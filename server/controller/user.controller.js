import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    // console.log("user", user, userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: "error in get current user" });
  }
};
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, assistantImage: bodyImage } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = bodyImage; // imageUrl from body
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.error("Update assistant error:", error);
    return res.status(400).json({ message: "update assistant error from controller" });
  }
};
