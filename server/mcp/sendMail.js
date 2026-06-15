import { google } from "googleapis";
import User from "../models/user.model.js";
import isAuth from "../middleware/isAuth.js";
export const sendMail = async (
  userId,
  to,
  subject,
  message
) => {
  try {
    const user = await User.findById(userId);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    console.log("USER:", user);
    console.log("REFRESH TOKEN:", user.googleRefreshToken);

    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken,
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      message,
    ].join("\n");

    const encodedMessage = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return "Email sent successfully";
  } catch (err) {
    console.log(err);
    return "Failed to send email";
  }
};