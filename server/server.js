const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const cors = require("cors");
const commands = require('../assets/json/commands-database.json');
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const actionsRoutes = require("./routes/actionsRoutes");
const { rateLimit } = require('express-rate-limit');

/**
 * @param {import('../struct/Client')} client
 */
module.exports = (client) => {
    const port = process.env.PORT || 4000;

    app.use(express.json());

    app.use(cors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PATCH'],
        credentials: true,
    }));

    app.use(rateLimit({
        windowMs: 10 * 60 * 1000,
        limit: 300,
        standardHeaders: 'draft-7',
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    }));

    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    // Session setup
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: 'sessions',
            ttl: 14 * 24 * 60 * 60,
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'None',
        },
    }));
    

    app.use(passport.initialize());
    app.use(passport.session());

    // Passport serialization
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });

    // Discord Strategy
    passport.use(new DiscordStrategy({
        clientID: client.user.id,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_REDIRECT_URI,
        scope: ['identify', 'email', 'guilds'],
    }, (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
    }));

    app.get('/client-stats', (req, res) => {
        try {
            // Transform client.user into a plain object
            const user = {
                id: client.user.id,
                username: client.user.username,
                discriminator: client.user.discriminator,
                avatar: client.user.avatar,
            };

            const commands = client.commands?.size;
            const SlashCommands = client.application.commands?.cache.size;

            const totalCommands = commands + SlashCommands;

            // Send the simplified data
            res.status(200).json({
                user,
                guilds: client.guilds.cache.size,
                members: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
                totalCommands
            });
        } catch (error) {
            // Log the error for debugging
            console.error(error);

            // Send the error response only if no response has been sent
            if (!res.headersSent) {
                res.status(500).send('An error occurred while processing your request.');
            }
        }
    });

    app.get('/commands-json', (req, res) => {
        try {
            res.status(200).json(commands)
        } catch (error) {
            console.log(error)
        }
    });

    const attachClient = (req, res, next) => {
        req.client = client;
        next();
    };

    app.use("/auth", authRoutes);

    app.use("/dashboard", attachClient, dashboardRoutes);

    app.use("/actions", attachClient, actionsRoutes);

    app.listen(port, () => console.log("Server is running on port " + port))
}