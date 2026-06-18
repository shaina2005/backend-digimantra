import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDatabase = async () => {
  try {    
    const db = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected : ", db.connection.name);
  } catch (error) {
    console.log("Error occurred while connecting database : ", error);
    process.exit(1);
  }
};
