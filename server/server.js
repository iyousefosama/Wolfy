const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const cors = require("cors");
const commands = require('../assets/json/commands-database.json');
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const actionsRoutes = require("./routes/actionsRoutes");
const { rateLimit } = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { info, success, error } = require('../util/console');
const jwt = require('jsonwebtoken');

/**
 * @param {import('../struct/Client')} client
 */
module.exports = (client) => {
    const port = process.env.PORT || 4000;

    const app = express()

    // Configure CORS for production
    app.use(cors({
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser());

    app.use(rateLimit({
        windowMs: 10 * 60 * 1000,
        limit: 300,
        standardHeaders: 'draft-7',
        legacyHeaders: false,
    }));

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    // Passport initialization
    app.use(passport.initialize());

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
        return done(null, { ...profile, accessToken, refreshToken });
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

    app.listen(port, () => success("🔆 Express server is running on port " + port))

    module.exports = app;
}