import express from "express";
import { sendMail } from "../mcp/sendMail.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/send-mail", isAuth, async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    const result = await sendMail(
      req.userId,
      to,
      subject,
      message
    );

    res.json({
      success: true,
      result,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
});

export default router;