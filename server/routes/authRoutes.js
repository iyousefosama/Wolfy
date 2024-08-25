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

  if (!cookies["connect.sid"])
    return res.status(404).send({ message: "no data here" });

  // res.setHeader("Set-Cookie", cookiesHeader);
  res.send({ key: "connect.sid", value: cookies["connect.sid"] });
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
