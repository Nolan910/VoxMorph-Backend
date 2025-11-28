import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import videoRoutes from "./routes/videoRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

app.use("/api/videos", videoRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
