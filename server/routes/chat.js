import express from "express";
import {
  createMessage,
  getConversations,
  getMessages,
  markMessageAsRead,
  createConversation,
  userConversation,
} from "../controllers/chat.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get all conversations for a user
router.get("/conversations", verifyToken, getConversations);

// Fetch conversations for a specific user
router.get("/conversations/:userId", verifyToken, userConversation);

// Create a new conversation between users
router.post("/create-conversation", verifyToken, createConversation);

// Get all messages in a specific conversation
router.get("/messages/:conversationId", verifyToken, getMessages);

// Create a new message in a specific conversation
router.post("/create-message", verifyToken, createMessage);

// Mark message as read
router.post("/messages/read", verifyToken, markMessageAsRead);

export default router;
