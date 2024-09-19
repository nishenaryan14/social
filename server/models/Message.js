// models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  attachments: [{ type: String }], // Adjust based on your needs
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

export default mongoose.model("Message", MessageSchema);
