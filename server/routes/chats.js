import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createChat, getChat, getUserChats } from "../controllers/chats.js";

const router = express.Router();

// Create a new chat or send a message
router.post("/", verifyToken, createChat);
// Get chats for a user
router.get("/:userId", verifyToken, getUserChats);
// Get a specific chat
router.get("/chat/:chatId", verifyToken, getChat);

export default router;
