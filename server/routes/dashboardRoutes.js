const router = require('express').Router();
const { isAuthenticated, haveGuildPermissions } = require("../utils/middlewares");
const fetchGuilds = require('../controllers/fetchGuilds');
const { getGuildController, getGuildChannelsController, getGuildMembersController, getGuildInfoController, getGuildData, patchGuildData } = require('../controllers/guildControllers');

// Route to get user info (use this to send user data to the frontend)
router.get('/user', isAuthenticated, (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.get('/guilds', isAuthenticated, fetchGuilds)

router.get('/guild/:id', isAuthenticated, haveGuildPermissions, getGuildController);

router.get('/guild-info/:id', isAuthenticated, haveGuildPermissions, getGuildInfoController)

router.get('/guild/:id/channels', isAuthenticated, haveGuildPermissions, getGuildChannelsController);

router.get('/guild/:id/members', isAuthenticated, haveGuildPermissions, getGuildMembersController);

router.get('/guild/:id/data', isAuthenticated, getGuildData);

router.patch('/guild/:id/data', isAuthenticated, patchGuildData);

module.exports = router;