const { Router } = require("express");
const passport = require("passport");
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
    // Successful authentication, redirect to the dashboard.
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);

router.get("/set-cookie", (req, res) => {
  let cookies = req.cookies;

  const cookiesHeader = Object.entries(cookies).map(([key, value]) => {
    res.cookie(key, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
      path: "/",
    });
  });

  res.setHeader("Set-Cookie", cookiesHeader);
  res.send("test");
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.FRONTEND_URL);
  });
});

module.exports = router;
