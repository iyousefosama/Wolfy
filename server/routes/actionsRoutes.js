const router = require('express').Router();
const { isAuthenticated, haveGuildPermissions } = require("../utils/middlewares");
const { sendWelcome, sendLeave } = require("../controllers/guildActions");

router.post('/guild/:id/welcome-test', isAuthenticated, haveGuildPermissions, sendWelcome);

router.post('/guild/:id/leave-test', isAuthenticated, haveGuildPermissions, sendLeave);

module.exports = router;
