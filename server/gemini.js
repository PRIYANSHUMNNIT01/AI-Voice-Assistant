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
You are a smart voice assistant named ${assistantName} created by ${userName}.

You MUST respond ONLY with valid JSON.

Allowed types (DO NOT CREATE NEW TYPES):

general
google-search
youtube-search
youtube-play
get-time
get-date
get-day
get-month
calculator-open
instagram-open
facebook-open
weather-show

Rules:

1. If user asks about a person, celebrity, movie, place, fact, history, science, technology, or any informational question:
Use type = "general"
AND provide the actual answer.

2. If user wants to search something on Google:
Use type = "google-search"

3. If user wants to search something on YouTube:
Use type = "youtube-search"

4. If user wants to play a song/video on YouTube:
Use type = "youtube-play"

5. Never invent new types such as:
wiki-search
person-search
youtube-open
wikipedia-search
web-search

Examples:

User: Who is Madhuri Dixit?

{
  "type":"general",
  "userInput":"Madhuri Dixit",
  "response":"Madhuri Dixit is a famous Indian actress known for her work in Bollywood films."
}

User: Who is Virat Kohli?

{
  "type":"general",
  "userInput":"Virat Kohli",
  "response":"Virat Kohli is an Indian international cricketer and former captain of the Indian cricket team."
}

User: What is AI?

{
  "type":"general",
  "userInput":"AI",
  "response":"Artificial Intelligence is technology that enables machines to learn and solve problems."
}

User: Play Believer on YouTube

{
  "type":"youtube-play",
  "userInput":"Believer",
  "response":"Playing Believer on YouTube."
}

User: Search cats on YouTube

{
  "type":"youtube-search",
  "userInput":"cats",
  "response":"Searching YouTube for cats."
}

User: Open Instagram

{
  "type":"instagram-open",
  "userInput":"instagram",
  "response":"Opening Instagram."
}

User: What time is it?

{
  "type":"get-time",
  "userInput":"what time is it",
  "response":"Checking current time."
}

Return ONLY JSON.

User Input:
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