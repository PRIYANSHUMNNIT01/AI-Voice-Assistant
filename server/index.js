import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/user.route.js"

dotenv.config()
const app=express()
const port =process.env.PORT || 5001
app.use(express.json())
app.use(cookieParser())
app.use("/",(req,res)=>{
    res.send(`hello world`)
})
app.use("/api/auth",router)

app.listen(port,()=>{
    connectDb();
    console.log(`server listening on port ${port}`)
})