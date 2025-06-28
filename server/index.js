import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import UserRouter from "./routes/user.route.js"
import geminiResponse from "./gemini.js"

dotenv.config()
const app=express()
app.use(cookieParser())
const port =process.env.PORT || 5001
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))
app.use(express.json())
app.get("/",async (req,res)=>{
    const prompt=req.query.prompt;
    let data=await geminiResponse(prompt)
    return res.json(data);
})
app.use("/api/auth",router)
app.use("/api/user",UserRouter)
app.get('/api/status', (req, res) => {
  res.status(200).json({ message: 'Server is working' });
});


app.listen(port,()=>{
    connectDb();
    console.log(`server listening on port ${port}`)
})