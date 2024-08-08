import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import mongoose from "mongoose";

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

// Configure multer to use multer-s3 for file uploads
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `uploads/${Date.now()}_${file.originalname}`); // Unique file name
    },
  }),
});

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public/images")));

// AWS S3 File Upload Route
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const imageUrl = req.file.location; // URL of the uploaded file
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// AUTH REGISTER WITH FILE UPLOAD
app.post("/auth/register", upload.single("picturePath"), async (req, res) => {
  try {
    if (req.file) {
      console.log("File uploaded:", req.file);
    } else {
      console.error("File upload error");
    }

    // Call the register function
    await register(req, res);
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE POST WITH FILE UPLOAD
app.post(
  "/posts",
  verifyToken,
  upload.single("picturePath"), // Handle file upload
  (req, res, next) => {
    if (req.file) {
      console.log("File uploaded:", req.file);
    } else {
      console.error("File upload error");
    }
    next();
  },
  createPost
);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 6001;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((error) => console.error(`MongoDB connection error: ${error}`));
