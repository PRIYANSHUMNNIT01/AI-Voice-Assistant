import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const key = process.env.GEMINI_API_KEY;

console.log("KEY:", key);

async function test() {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        contents: [
          {
            parts: [{ text: "Hello" }]
          }
        ]
      }
    );

    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

test();