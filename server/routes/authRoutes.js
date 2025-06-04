const { Router } = require("express");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const router = Router();

router.get(
  "/discord",
  passport.authenticate("discord", {
    failureRedirect: process.env.FRONTEND_URL,
  })
);

// Discord will redirect to this route after authentication
router.get(
  "/discord/callback",
  passport.authenticate("discord", {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  (req, res) => {
    // Create JWT token
    const token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.username,
        discriminator: req.user.discriminator,
        avatar: req.user.avatar,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

router.get("/logout", (req, res) => {
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
