import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/verifyToken.js";
import socketSetup from "./socket.js"; // Import Socket setup

// Load environment variables
dotenv.config();

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AWS S3 Configuration
const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
  },
});

// Multer S3 file upload setup
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) =>
      cb(null, `uploads/${Date.now()}_${file.originalname}`),
  }),
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your client origin
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public/images")));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chats", chatRoutes);

// S3 File Upload Route
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json({ imageUrl: req.file.location });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// AUTH Register with File Upload
app.post("/auth/register", upload.single("picturePath"), async (req, res) => {
  try {
    await register(req, res);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE Post with File Upload
app.post(
  "/posts",
  verifyToken,
  upload.single("picturePath"),
  (req, res, next) => {
    next();
  },
  createPost
);

// Initialize socket.io with the server
socketSetup(io);

// MongoDB connection and Server start
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
