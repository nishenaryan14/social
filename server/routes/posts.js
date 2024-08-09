import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  addComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Existing routes
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);

router.post("/:id/comment", verifyToken, addComment);

export default router;
