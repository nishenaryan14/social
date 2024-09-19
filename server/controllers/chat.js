import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.user.id] },
    })
      .populate("participants", "firstName picturePath")
      .populate("lastMessage");
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

export const userConversation = async (req, res) => {
  const userId = req.user.id; // Extract from req.user instead of req.params

  try {
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "firstName picturePath")
      .populate("lastMessage");

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error); // Log detailed error
    res.status(500).json({ message: "Error fetching conversations", error });
  }
};

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(req.user.id)
    ) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    console.log("Request User ID:", req.user.id);
    console.log("User ID:", userId);

    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, userId],
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
};

// Get all messages in a specific conversation
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.conversationId,
    })
      .populate("sender", "firstName picturePath") // Populate sender with user details
      .populate("receiver", "firstName picturePath"); // Optionally populate receiver too if needed

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { content, receiver, roomId, attachments } = req.body;
    console.log(req.user.id);
    console.log(roomId);
    const message = await Message.create({
      sender: req.user.id,
      receiver,
      content,
      roomId,
      attachments: attachments || [],
    });

    await Conversation.findByIdAndUpdate(roomId, {
      lastMessage: message,
      updatedAt: new Date(),
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.body;
    await Message.findByIdAndUpdate(messageId, { isRead: true });
    res.status(200).json({ message: "Message marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark message as read" });
  }
};
