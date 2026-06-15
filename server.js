import express from "express";
import userRoutes from "./routes/user.routes.js"
import dotenv from "dotenv";
dotenv.config()
const PORT = process.env.PORT;

const app =express();

app.use(express.json());

app.use("/user" , userRoutes)


app.listen(PORT,()=>{
    console.log("Server started on port: " , PORT); 
})