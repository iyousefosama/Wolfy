const getMutualGuilds = require("../utils/helpers/getMutualGuilds")
const { getUserGuilds, getBotGuilds } = require("../utils/services/getGuilds");

/**
 * Returns a response json with commonGuilds
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const fetchGuilds = async (req, res) => {
    try {
        // Fetch the user's guilds
        const userGuilds = await getUserGuilds(req.user);

        // Fetch the bot's guilds
        const botGuilds = await getBotGuilds();

        // Filter the guilds that both the user and bot are in
        const commonGuilds = await getMutualGuilds(userGuilds, botGuilds);

        res.json(commonGuilds);
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to fetch guilds' });
    }
}

module.exports = fetchGuilds;