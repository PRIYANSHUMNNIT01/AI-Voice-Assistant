import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/UserDataContext.js";
import axios from "axios";
import speakImg from "../assets/speak.gif";
import listenImg from "../assets/listen.gif";
import { useNavigate } from 'react-router-dom';
import { MdOutlineMenu } from "react-icons/md"
import { ImCross } from "react-icons/im"

const Home = () => {
  const { userData, serverUrl, getGeminiResponse } =
    useContext(UserDataContext);
    const navigate = useNavigate()

  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [ham, setHam] = useState(false)
  const isSpeakingRef = useRef(false)
  const greetedRef = useRef(false)  // ✅ Prevent multiple greetings
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const synth = window.speechSynthesis;
  
  // 🔌 Logout handler
  const handleLogOut = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
      setUserData(null);
    }
  };

  // 🗣️ Text-to-speech function
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => startRecognition(), 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  // ▶️ Command handler
  const handleCommand = ({ type, userInput, response }) => {
    speak(response);

    const openInNewTab = (url) => window.open(url, "_blank");

    const query = encodeURIComponent(userInput);

    switch (type) {
      case "facebook-open":
        openInNewTab("https://www.facebook.com/");
        break;
      case "instagram-open":
        openInNewTab("https://www.instagram.com/");
        break;
      case "weather-show":
        openInNewTab("https://www.google.com/search?q=weather");
        break;
      case "calculator-open":
        openInNewTab("https://www.google.com/search?q=calculator");
        break;
      case "youtube-play":
      case "youtube_search":
        openInNewTab(`https://www.youtube.com/results?search_query=${query}`);
        break;
      case "google-search":
        openInNewTab(`https://www.google.com/search?q=${query}`);
        break;
      default:
        break;
    }
  };

  // 🎤 Speech recognition setup
  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition started");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Recognition error:", error);
        }
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !userData?.assistantName) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    // 👂 Recognition started
    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    // 🛑 Recognition ended
    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
            console.log("Recognition restarted");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }, 1000);
      }
    };

    // ⚠️ On error
    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
            console.log("Recognition restarted after error");
          } catch (e) {
            if (e.name !== "InvalidStateError") console.error(e);
          }
        }, 1000);
      }
    };

    // ✅ Handle speech input
    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        try {
          const data = await getGeminiResponse(transcript);
          handleCommand(data);
          setAiText(data.response);
        } catch (err) {
          console.error("AI error:", err);
          speak("Sorry, something went wrong.");
        }
      }
    };

    // 👋 Initial greeting
    if (!greetedRef.current && userData?.name) {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
      greeting.lang = "en-US";
      greeting.onend = () => {
        greetedRef.current = true;
        startRecognition();
      };
      synth.cancel();
      synth.speak(greeting);
    } else {
      startRecognition();
    }

    return () => {
      isMounted = false;
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
    };
  }, [userData]);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#000000] via-[#000010] to-[#000033]
     flex justify-center items-center flex-col gap-[15px] relative overflow-hidden pt-8'>

      <MdOutlineMenu className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
        onClick={() => setHam(true)} />

      <div className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] 
       background-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${ham ?
          "translate-x-0" : "translate-x-full"
        } transition-transform`}>
        <ImCross className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
          onClick={() => setHam(false)} />

        <button className='min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold 
        text-[19px] top-[20px] right-[20px] px-[20px] py-[10px] cursor-pointer'
          onClick={handleLogOut}>  Log Out
        </button>

        <button className='min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold 
        text-[19px] top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer'
          onClick={() => navigate("/customize")} > Customize your  Assistant
        </button>
        <div className='w-full h-[2px] bg-gray-400'></div>
        <h1 className='text-white font-semibold'>History</h1>

        <div className='w-full h-[400px] overflow-y-auto flex flex-col gap-[20px]'>
          {userData.history?.map((his, index) => (
            <span key={index} className='text-gray-200 text-[18px] truncate'>{his}</span>
          ))}
        </div>
      </div>
      <button className='min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold absolute hidden lg:block
        text-[19px] top-[20px] right-[20px] px-[20px] py-[10px] cursor-pointer'
        onClick={handleLogOut}>  Log Out
      </button>

      <button className='min-w-[150px] h-[60px] bg-white rounded-full text-black font-semibold absolute hidden lg:block
        text-[19px] top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer'
        onClick={() => navigate("/customize")} > Customize your  Assistant
      </button>

      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover' />
      </div>

      <h1 className='text-white font-bold text-[18px]'>I am {userData?.assistantName}</h1>
      {!isSpeakingRef.current && <img src={listenImg} alt='' className='w-[200px]' /> }
      {isSpeakingRef.current && <img src={speakImg} alt='' className='w-[200px]' />}
      <h1 className='text-white text-[18px] font-semibold text-wrap'>
        
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  )
};

export default Home;
