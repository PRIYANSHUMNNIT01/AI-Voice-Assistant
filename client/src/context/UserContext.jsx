import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserDataContext } from "./UserDataContext";

const UserContext = ({ children }) => {
 
  const serverUrl = "http://localhost:5001";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoggedIn,setIsLoggedIn] = useState(false);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      // console.log("first")
      console.log(result.data)
      setUserData(result.data);
    } catch (error) {
      console.error("error in handlecurrentuser ", error);
      setUserData(null);
    }
  };

  const getGeminiResponse = async (command) => {
    console.log("SENDING TO BACKEND:", command);
  
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/ask`,
        { command },
        { withCredentials: true }
      );
  
      console.log("BACKEND REPLIED:", result.data);
  
      return result.data;
    } catch (err) {
      console.log("AXIOS ERROR:", err);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    isLoggedIn,setIsLoggedIn,
    setUserData,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
