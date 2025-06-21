import React, { useContext, useEffect } from "react";
import { UserDataContext } from "../context/UserDataContext.js";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, getGeminiResponse } =
    useContext(UserDataContext);
  const handleLogout = async () => {
    try {
      const res = axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const speak = (text)=>{
    const utterence = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterence)
  }
  useEffect(() => {
    const speechRecognition =
      window.speechRecognition || window.webkitSpeechRecognition;
    const recognition = new speechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.onresult = async (e) => {
      const transcript = e.results[e.resultIndex][0]?.transcript;
      console.log("heard : ", transcript);
      if (!userData) console.log("userData loading...");
      if (
        transcript?.toLowerCase().includes(userData?.assistantName?.toLowerCase())
      ) {
        const data = await getGeminiResponse(transcript);
        speak(data.response)
        console.log(data);
      }
    };
    recognition.start();
    return () => {
      recognition.stop();
      console.log("Voice recognition stopped.");
    };
  }, [userData]);
  return (
    <div>
      <div className="min-h-screen w-full bg-gradient-to-t from-black to-[#0400bc] overflow-y-auto flex justify-center items-center py-10 px-4 flex-col relative">
        <button
          className="bg-white rounded-full mb-4 px-4 py-2 absolute right-5 top-10"
          onClick={handleLogout}
        >
          Log Out
        </button>
        <button className="bg-white rounded-full mb-4 px-4 py-2 absolute right-5 top-25">
          Customize your Assistant
        </button>
        {userData?.assistantImage && (
          <img
            src={userData.assistantImage}
            alt=""
            className="w-[300px] h-[400px] rounded-2xl shadow-xl shadow-blue-600"
          />
        )}
        <h1 className="text-white mt-6 text-2xl">
          I'm {userData?.assistantName}
        </h1>
      </div>
    </div>
  );
};

export default Home;
