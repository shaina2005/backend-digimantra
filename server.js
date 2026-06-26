import express from "express";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { auth } from "./middleware/auth.middleware.js";
import { connectDatabase } from "./database/database.js";
import { generateSuperAdmin } from "./helpers/superAdmin.js";
dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDatabase();
generateSuperAdmin();

app.use((req, res, next) => {
  const time = new Date().toLocaleString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/login" , loginRoutes)
app.use("/user", auth, userRoutes);
app.use("/product", auth, productRoutes);

app.listen(PORT, () => {
  console.log("Server started on port: ", PORT);
});

// ORM, ODM ? for db?
