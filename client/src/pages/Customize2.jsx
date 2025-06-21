import { useContext, useState } from "react";
import { UserDataContext } from "../context/UserDataContext.js";
import axios from "axios";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
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
  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );
  const handleSubmit = async () => {
  try {
    const formData = new FormData();
    // console.log("backendImage",backendImage," selctedImage =",selectedImage)
    formData.append("assistantName", assistantName);
    console.log(selectedImage)
    formData.append("assistantImage", selectedImage);

    const result = await axios.post(
      `${serverUrl}/api/user/update`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // required for file upload
        },
      }
    );

    console.log("Update successful:", result.data);
    navigate("/");
  } catch (error) {
    console.error("Update error:", error.message);
  }
};

  return (
    <div className="min-h-screen w-full bg-gradient-to-t from-black to-[#0400ff] overflow-y-auto flex justify-center items-center py-10 px-4 flex-col relative">
      <IoArrowBackOutline className="absolute text-xl text-white left-20 top-10" onClick={()=>navigate("/customize")}/>
      <h1 className="text-white text-3xl mb-10">
        Enter your <span className="text-blue-200">Assistant Name</span>
      </h1>
      <input
        type="text"
        className="max-w-[600px] text-white px-4 w-full py-4 rounded-full border border-white"
        placeholder="eg. Shifra"
        required
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />
      {assistantName && (
        <button
          className="px-6 py-3 bg-white font-semibold rounded-lg shadow-md transition-all duration-300  hover:scale-105 active:scale-95 mt-10"
          onClick={handleSubmit}
        >
          Finally Create Your Assistant{" "}
        </button>
      )}
    </div>
  );
};

export default Customize2;
