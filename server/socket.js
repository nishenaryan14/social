import jwt from "jsonwebtoken";
import User from "./models/User.js"; // Import User model

export default function socketSetup(io) {
  // Authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error("JWT verification failed:", err.message);
          return next(new Error("Authentication error: Invalid token"));
        }
        socket.user = decoded;
        next();
      });
    } else {
      next(new Error("Authentication error: Token missing"));
    }
  });

  // On socket connection
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.id}`);

    // User joins a chat room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.user.id} joined room ${roomId}`);
    });

    // Handle sending messages - ONLY emit the message, message creation happens in the controller
    socket.on("message", async (messageData) => {
      const { roomId, content, sender, receiver } = messageData;

      try {
        if (!receiver || !roomId || !content || !sender) {
          console.error("Missing required fields");
          return;
        }

        // Fetch sender and receiver details to include in the emitted message
        const senderDetails = await User.findById(sender);
        const receiverDetails = await User.findById(receiver);

        // Emit the new message to the chat room with user details
        io.to(roomId).emit("message", {
          ...messageData,
          sender: {
            _id: senderDetails._id,
            firstName: senderDetails.firstName,
            picturePath: senderDetails.picturePath,
          },
          receiver: {
            _id: receiverDetails._id,
            firstName: receiverDetails.firstName,
            picturePath: receiverDetails.picturePath,
          },
        });

        console.log(
          `Message sent in room ${roomId} by user ${senderDetails._id}`
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    // Handle marking messages as read
    socket.on("markAsRead", async ({ roomId }) => {
      try {
        await Message.updateMany(
          { roomId, receiver: socket.user.id, read: false },
          { read: true }
        );
        console.log(
          `Messages in room ${roomId} marked as read by user ${socket.user.id}`
        );
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
}
