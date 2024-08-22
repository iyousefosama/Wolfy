const router = require('express').Router();
const { isAuthenticated, haveGuildPermissions } = require("../utils/middlewares");

router.get('/guild/:id/welcome-test', isAuthenticated, haveGuildPermissions, async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;
        const client = req.client;

        const guild = client.guilds.cache.get(id);
        if (!guild) {
            return res.status(404).json({ msg: 'Guild not found' });
        }

        const members = await guild.members.fetch();
        const member = members.get(userId);

        if (!member) {
            return res.status(404).json({ msg: 'Member not found in the guild' });
        }

        client.emit('guildMemberAdd', member);
        res.status(200);
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error('Error fetching guild members:', error);
        res.status(500).json({ msg: 'Failed to process the request' });
    }
});

module.exports = router;
