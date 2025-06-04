const getMutualGuilds = require("./helpers/getMutualGuilds");
const { getUserGuilds, getBotGuilds } = require("../utils/services/getGuilds");
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ msg: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: "Token expired" });
        }
        return res.status(401).json({ msg: "Invalid token" });
    }
};

// Check if the user has permission to use the specified guild, Use with isAuthenticated middleware
const haveGuildPermissions = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = req.user;

        // Fetch the user's guilds
        const userGuilds = await getUserGuilds(user);

        // Fetch the bot's guilds
        const botGuilds = await getBotGuilds();

        // Filter the guilds that both the user and bot are in
        const commonGuilds = await getMutualGuilds(userGuilds, botGuilds);

        const valid = commonGuilds.some(guild => guild.id === id);

        if (!valid) {
            return res.status(403).json({ msg: 'Invalid guild' });
        }

        next();
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        if(error.response?.status === 401) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch guilds' });
    }
}

module.exports = { isAuthenticated, haveGuildPermissions };