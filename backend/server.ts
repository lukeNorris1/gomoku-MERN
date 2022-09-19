import express from "express";
import { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middlewares/errorMiddleware";

// Routes
// import userRoutes from "./routes/userRoutes";
// import bookingRoutes from "./routes/bookingRoutes";
// import uploadRoutes from "./routes/uploadRoutes";

import gameHandler from "./routes/games.handler";

const app: Application = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Default
app.get("/api", (req: Request, res: Response) => {
  res.status(201).json({ message: "Welcome to Gomoku App" });
});

// Room Route
app.use("/api/games", gameHandler);



app.use(errorHandler);
app.use(notFound);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (): void => console.log(`Server is running on PORT ${PORT}`));
