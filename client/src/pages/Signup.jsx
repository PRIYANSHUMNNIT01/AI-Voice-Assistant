import React, { useContext, useState } from "react";
import bg from "../assets/image.webp";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { Link } from "react-router";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { serverUrl } = useContext(UserDataContext);
  const handleEye = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="min-h-screen bg-center bg-no-repeat bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form className="w-full max-w-[90%] sm:max-w-[400px] md:max-w-[500px] text-white bg-[#3b475653] backdrop-blur-md h-[600px] shadow-2xl flex flex-col items-center px-6 py-8 rounded-2xl mx-auto lg:-translate-x-80 sm:-translate-x-40">
        <h1 className="mb-30 text-3xl font-bold text-center">
          Register to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        <input
          className="w-full mb-5 px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your Name"
        />
        <input
          className="w-full mb-5 px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter your Email Address"
        />
        <div className="w-full relative">
          <input
            className="w-full mb-8 px-4 py-3 rounded-md bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
          />
          {!showPassword ? (
            <IoEye
              className="absolute top-4 right-6 hover:text-blue-200 transition-all duration-200"
              onClick={handleEye}
            />
          ) : (
            <IoEyeOff
              className="absolute top-4 right-6 hover:text-blue-200 transition-all duration-200"
              onClick={handleEye}
            />
          )}
        </div>

        <button
          className="w-full mb-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold transition-all"
          onClick={handleSubmit}
        >
          Register
        </button>
        <p>
          Already Have an account?{" "}
          <Link to={"/login"} className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
