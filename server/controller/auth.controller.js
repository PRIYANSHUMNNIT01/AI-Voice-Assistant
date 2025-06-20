import generateToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existEmail = await User.findOne({ email });
    if (existEmail)
      return res.status(400).json({ message: "email already exist" });
    if (password.length < 4)
      return res.status(400).json({ message: "password length less than 4" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      expiresIn: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "signUp error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "email doesn't exist" });
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "wrong password" });
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      expiresIn: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false,
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "login error" });
  }
};
export const logout = (req,res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"logged out successfully"})
    } catch (error) {
        return res.status(500).json(error);
    }
}
