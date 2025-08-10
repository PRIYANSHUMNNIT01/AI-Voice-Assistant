import React, { useContext, useEffect, useRef, useState } from "react";
import { UserDataContext } from "../context/UserDataContext.js";
import axios from "axios";
import speakImg from "../assets/speak.gif";
import listenImg from "../assets/listen.gif";
import { useNavigate } from "react-router-dom";
import { MdOutlineMenu } from "react-icons/md";
import { ImCross } from "react-icons/im";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext)
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

  const handleLogOut = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/auth/logout`, {},
        { withCredentials: true }
      )
      setUserData(null)
      navigate("/signin")
      console.log("rest is history")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        // setListening(true);
        console.log("Recognition requested to Start");
      } catch (error) {
        if (!error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  }

  //speak function
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text)
    isSpeakingRef.current = true
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false
      setTimeout(() => {
        startRecognition();
      }, 800);
    }
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);
    if (type === 'facebook-open') {
      window.open('https://www.facebook.com/', '_blank');
    }

    if (type === 'weather-show') {
      window.open('https://www.google.com/search?q=weather', '_blank');
    }

    if (type === 'youtube_search' || type === 'youtube-play') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }

    if (type === 'google-search') {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }

    if (type === 'calculator-open') {
      window.open('https://www.google.com/search?q=calculator', '_blank');
    }

    if (type === 'instagram-open') {
      window.open('https://www.instagram.com/', '_blank');
    }
  };

  //convert speech into text
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognitionRef.current = recognition

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.error(e);
          }
        }
      }
    }, 1000);

   

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    }

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error(e);
              }
            }
          }
        }, 1000)
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error")
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.error(e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard : " + transcript);
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAiText("")
        setUserText(transcript)
        recognition.stop()
        isRecognizingRef.current = false
        setListening(false)
        const data = await getGeminiResponse(transcript);
        console.log(data)
        handleCommand(data)
        setAiText(data.response)
        setUserText("")
      }
    }

    if (!greetedRef.current && userData?.name) {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
      greeting.lang = 'en-US';
      greeting.onend = () => {
        greetedRef.current = true;
        startRecognition();
      }
      synth.cancel();
      synth.speak(greeting);
    }

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop()
      setListening(false)
      isRecognizingRef.current = false
      // clearInterval(fallback)
    }

  }, []);

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#000000] via-[#000010] to-[#000033]
     flex justify-center items-center flex-col gap-[15px] relative overflow-hidden'>

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
}

export default Home