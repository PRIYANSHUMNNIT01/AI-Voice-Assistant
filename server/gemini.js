import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

console.log("GROQ KEY =", process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const geminiResponse = async (command, assistantName, userName) => {
  try {
    const prompt = `
You are a voice assistant.

You MUST respond ONLY with valid JSON.

Examples:

User: play believer on youtube
Response:
{
  "type":"youtube-play",
  "userInput":"believer",
  "response":"Playing believer on YouTube."
}

User: search cats on youtube
Response:
{
  "type":"youtube-search",
  "userInput":"cats",
  "response":"Searching YouTube for cats."
}

User: search javascript on google
Response:
{
  "type":"google-search",
  "userInput":"javascript",
  "response":"Searching Google for javascript."
}

User: open instagram
Response:
{
  "type":"instagram-open",
  "userInput":"instagram",
  "response":"Opening Instagram."
}

User: what time is it
Response:
{
  "type":"get-time",
  "userInput":"what time is it",
  "response":"Checking current time."
}

Now classify:

${command}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.log("GROQ ERROR:");
    console.log(error);

    return JSON.stringify({
      type: "general",
      userInput: command,
      response: "Sorry, I am unavailable right now.",
    });
  }
};

export default geminiResponse;