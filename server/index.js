import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/post.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";


// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
const connect = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Database!");
        // ADD DATA ONE TIME
        // User.insertMany(users);
        // Post.insertMany(posts);
    }catch(err){
        console.log(`${err}, did not connect!`);
    }
};

mongoose.set("strictQuery", true);
mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

// File Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// Routes with files 
app.post("/api/auth/register", upload.single("picture"), register);
app.post("/api/posts", verifyToken, upload.single("picture"), createPost);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port: ${PORT}`);
});
