import React, { useContext } from "react";
import { UserDataContext } from "../context/UserContext";

const Card = ({ image }) => {
  const {
      serverUrl,userData, setUserData,frontendImage, setFrontendImage,backendImage, setBackendImage,selectedImage, setSelectedImage
    } = useContext(UserDataContext);
  return (
    <div className={`w-[70px] h-[140px] lg:w-[200px] lg:h-[300px] border-2 border-[#0000ffc6] rounded-2xl hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${selectedImage==image?"shadow-2xl shadow-blue-950 cursor-pointer border-4 border-white":null}`}
    onClick={()=>setSelectedImage(image)}
    >
      <img
        src={image}
        className="h-full w-full object-cover rounded-md"
        alt="custom card"
      />
    </div>
  );
};

export default Card;
