import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import router from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/user.route.js";
import geminiResponse from "./gemini.js";

import session from "express-session";
import passport from "./config/passport.js";
import googleRouter from "./routes/google.route.js";
import mailRouter from "./routes/mail.route.js";
import { sendMail } from "./mcp/sendMail.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-vercel-app.vercel.app"
    ],
    credentials: true
   
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Test Mail Route
app.get("/test-mail", async (req, res) => {
  try {
    const result = await sendMail(
        "6a2846a62b76bd870760528c",
        "priyanshukumar6712@gmail.com",
        "Test Email",
        "Hello from AI Voice Assistant"
      );

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Main Route
app.get("/", async (req, res) => {
  try {
    const prompt = req.query.prompt;

    if (!prompt) {
      return res.json({
        message: "Server running successfully",
      });
    }

    const data = await geminiResponse(prompt);

    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error",
    });
  }
});

// Routes
app.use("/api/auth", router);
app.use("/api/auth", googleRouter);
app.use("/api/user", UserRouter);
app.use("/api", mailRouter);

app.get("/api/status", (req, res) => {
  res.status(200).json({
    message: "Server is working",
  });
});

app.listen(port, () => {
  connectDb();
  console.log(`server listening on port ${port}`);
});