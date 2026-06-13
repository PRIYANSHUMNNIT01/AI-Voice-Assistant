import express from "express";
import passport from "passport";
import generateToken from "../config/token.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),

  async (req, res) => {

    const token = generateToken(req.user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    res.redirect("http://localhost:5173");
  }
);

export default router;