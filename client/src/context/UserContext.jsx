import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
export const UserDataContext = createContext();
const UserContext = ({ children }) => {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState();
  const [backendImage, setBackendImage] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      // console.log("hello ---",result.data);
      setUserData(result.data);
    } catch (error) {
      console.log("error in handle current user ",error);
    }
  };
  useEffect(() => {
    handleCurrentUser();
  }, []);
  const value = {
    serverUrl,userData, setUserData,frontendImage, setFrontendImage,backendImage, setBackendImage,selectedImage, setSelectedImage
  };
  return (
  <UserDataContext.Provider value={value}>
    {children}
  </UserDataContext.Provider>
);

};

export default UserContext;
