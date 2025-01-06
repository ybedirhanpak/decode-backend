import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { apiRoutes } from "./routes/api";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7001;

const corsOptions = {
    origin: process.env.NODE_ENV === "production" ? process.env.APP_URL : "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Server is working!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
