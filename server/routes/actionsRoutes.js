const router = require('express').Router();
const { isAuthenticated, haveGuildPermissions } = require("../utils/middlewares");

router.post('/guild/:id/welcome-test', isAuthenticated, haveGuildPermissions, (req, res) => {
    try {
        const { id } = req.params;
        const client = req.client;

        //client.emit('guildMemberAdd', member);
        res.json({ msg: 'Success' });
    } catch (error) {
        if (error.response?.status === 429) {
            return res.status(429).json({ msg: 'Rate limit exceeded. Please try again later.' });
        }
        console.error(error);
        res.status(500).json({ msg: 'Failed to post the request' });
    }
})

module.exports = router;