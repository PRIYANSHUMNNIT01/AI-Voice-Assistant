import express from "express"
import dotenv from "dotenv"
dotenv.config()
const app=express()
const port =process.env.PORT || 5001

app.use("/",(req,res)=>{
    res.send(`hello world`)
})
app.listen(port,()=>{
    console.log(`server listening on port ${port}`)
})