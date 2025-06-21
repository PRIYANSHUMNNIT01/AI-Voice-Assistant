import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import { UserDataContext } from "./context/UserDataContext";

const AppRoutes = () => {
  const { userData, isLoggedIn } = useContext(UserDataContext);

return (
  <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/customize" element={<Customize/>}/>
      <Route path="/customize2" element={<Customize2/>}/>
    </Routes>
);
};

export default AppRoutes;
