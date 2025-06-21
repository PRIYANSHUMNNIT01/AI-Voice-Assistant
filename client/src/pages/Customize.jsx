import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import img1 from "../assets/img1.avif";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import img5 from "../assets/img5.jpeg";
import img6 from "../assets/img6.jpeg";
import img7 from "../assets/ai_img.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { UserDataContext } from "../context/UserDataContext.js";
import Customize2 from "./Customize2.jsx";
import { IoArrowBackOutline } from "react-icons/io5";

const Customize = () => {
  const images = [img1, img2, img3, img4, img5, img6, img7];
  const navigate=useNavigate()
  const {
    serverUrl,
    userData,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);
  const inputImage = useRef();
  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-black to-[#0400ff] overflow-y-auto flex justify-center items-center py-10 px-4 flex-col">
      <IoArrowBackOutline className="absolute text-xl text-white left-20 top-10" onClick={()=>navigate("/")}/>
      <h1 className="text-white text-3xl mb-10">
        Select your <span className="text-blue-200">Assistant Image</span>
      </h1>
      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-5 mb-6">
        {images.map((url, index) => (
          <Card key={index} image={url} />
        ))}

        <div
          className={`w-[70px] h-[140px] lg:w-[200px] lg:h-[300px] cursor-pointer hover:border-4 hover:border-white
     text-white text-2xl flex justify-center items-center border-2 border-[#0000ffc6] rounded-md transition-all duration-300 ${
       selectedImage === "input"
         ? "shadow-2xl shadow-blue-950 cursor-pointer border-4 border-white"
         : null
     }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage ? (
            <RiImageAddLine />
          ) : (
            <img
              className="h-full w-full object-cover"
              src={frontendImage}
              alt="image"
            />
          )}
        </div>
        
        <input
          type="file"
          hidden
          accept="image/*"
          ref={inputImage}
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button className="px-6 py-3 bg-white font-semibold rounded-lg shadow-md transition-all duration-300  hover:scale-105 active:scale-95"
        onClick={() => navigate("/customize2")}>
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;
