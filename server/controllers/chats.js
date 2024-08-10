import Chat from "../models/Chat.js";
export const createChat = async (req, res) => {
  const { userId, friendId, message } = req.body;

  try {
    let chat = await Chat.findOne({ members: { $all: [userId, friendId] } });

    if (!chat) {
      chat = new Chat({
        members: [userId, friendId],
        messages: [{ sender: userId, text: message }],
      });
    } else {
      chat.messages.push({ sender: userId, text: message });
    }

    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ members: userId }).populate(
      "members",
      "firstName lastName picturePath"
    );
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to get chats" });
  }
};

export const getChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId).populate(
      "members",
      "firstName lastName picturePath"
    );
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: "Failed to get chat" });
  }
};
