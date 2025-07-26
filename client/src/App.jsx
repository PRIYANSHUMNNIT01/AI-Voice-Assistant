import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Customize from "./pages/Customize";
import Customize2 from "./pages/Customize2";
import { UserDataContext } from "./context/UserDataContext";
import { ImSpinner11 } from "react-icons/im";

const AppRoutes = () => {
  const { userData } = useContext(UserDataContext);
  if (userData === undefined) {
    return <div className="flex flex-col items-center min-h-screen justify-center">
      <ImSpinner11 className="text-2xl animate-spin mb-4" />
      <p>Loading...</p>
      </div>;
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
            <Customize />
        }
      />
      <Route
        path="/customize2"
        element={
            <Customize2 />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
