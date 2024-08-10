import React, { useEffect } from "react";
import Chat from "scenes/chat/Chat";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchChats, setSelectedChat, fetchMessages } from "../../state/index";

const ChatPage = () => {
  const theme = useTheme();
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;

  const { _id: loggedInUserId } = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chats);
  const selectedChat = useSelector((state) => state.selectedChat);
  const messages = useSelector((state) => state.messages);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  const dispatch = useDispatch();

  // Fetch user chats on component mount
  useEffect(() => {
    if (loggedInUserId) {
      dispatch(fetchChats(loggedInUserId));
    }
  }, [loggedInUserId, dispatch]);

  // Fetch chat messages when a chat is selected
  const handleChatSelect = (chatId) => {
    dispatch(setSelectedChat(chatId));
    dispatch(fetchMessages(chatId));
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: alt,
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      {/* Left side - Chats List */}
      <Box
        sx={{
          width: { xs: "100%", sm: "25%" },
          backgroundColor: background,
          borderRight: { xs: "none", sm: "1px solid #ccc" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          color={primaryLight}
          sx={{ padding: "1rem", borderBottom: "1px solid #ccc" }}
        >
          GoChat
        </Typography>
        {loading && <Typography>Loading chats...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        <List sx={{ overflowY: "auto", flexGrow: 1 }}>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <ListItem
                button
                key={chat._id}
                onClick={() => handleChatSelect(chat._id)}
                selected={chat._id === selectedChat}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#d0d0d0",
                  },
                }}
              >
                <ListItemText
                  primary={`Chat with ${chat.members.join(", ")}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography>No chats available</Typography>
          )}
        </List>
      </Box>

      {/* Right side - Chat Interface */}
      <Box
        sx={{
          width: { xs: "100%", sm: "75%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {selectedChat ? (
          <Chat messages={messages} />
        ) : (
          <Typography variant="h6" sx={{ color: "#888" }}>
            Select a chat to start messaging
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
