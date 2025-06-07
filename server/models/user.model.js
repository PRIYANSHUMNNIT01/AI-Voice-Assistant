import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    assistantName: {
      type: String,
    },
    assistantImage: {
      type: String,
    },
    history: [
      {
        type: String,
      },
    ],
  },
  { timeStamps: true }
);

const User=mongoose.model("User",userSchema)
export default User
