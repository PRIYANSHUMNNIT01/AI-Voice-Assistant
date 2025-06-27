import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import { UserDataContext } from "./context/UserDataContext";

const AppRoutes = () => {
  const { userData } = useContext(UserDataContext);
  if (userData === null) {
    return <div>Loading...</div>; // or a spinner
  }
  return (
    <Routes>
      <Route
        path="/"
        element={
          !userData?<Navigate to="/login"/>:<Home/>
        }
      />
      <Route
        path="/signup"
        element={userData ? <Navigate to="/" replace /> : <Signup />}
      />
      <Route
        path="/login"
        element={userData ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/customize"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Navigate to="/" replace />
          ) : (
            <Customize />
          )
        }
      />
      <Route
        path="/customize2"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Navigate to="/" replace />
          ) : (
            <Customize2 />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
