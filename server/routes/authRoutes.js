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

  res.cookie("connect.sid", cookies["connect.sid"], {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "strict",
    path: "/",
  });


  // res.setHeader("Set-Cookie", cookiesHeader);
  res.send({message:"done set cookie"});
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
