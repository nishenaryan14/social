import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Paper,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  Divider,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachmentIcon from "@mui/icons-material/Attachment";
import axios from "axios";
import { useSelector } from "react-redux";
import useSocket from "../../utils/socket";
import { format, isToday } from "date-fns";

const ChatArea = ({ selectedChat, token, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { _id: userId } = useSelector((state) => state.user);
  const socket = useSocket(token);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const primaryLight = theme.palette.primary.dark;
  const background = theme.palette.background.default;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const response = await axios.get(
            `https://social-ty3k.onrender.com/chats/messages/${selectedChat._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedChat, token]);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("joinRoom", selectedChat._id);
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage) => {
        if (newMessage.roomId === selectedChat._id) {
          setMessages((prevMessages) => {
            const isMessageDuplicate = prevMessages.some(
              (msg) => msg._id === newMessage._id
            );
            if (!isMessageDuplicate) {
              return [...prevMessages, newMessage];
            }
            return prevMessages;
          });
        }
      };

      socket.on("message", handleNewMessage);

      return () => {
        socket.off("message", handleNewMessage); // Clean up listener
      };
    }
  }, [socket, selectedChat]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const messageData = {
        content: message,
        roomId: selectedChat._id,
        sender: userId,
        receiver: selectedChat.participants.find(
          (participant) => participant._id !== userId
        )._id,
      };

      const response = await axios.post(
        `https://social-ty3k.onrender.com/chats/create-message`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("");
      socket.emit("message", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherParticipant = selectedChat.participants.find(
    (participant) => participant._id !== userId
  );

  const renderDateDivider = (date) => {
    if (isToday(new Date(date))) {
      return (
        <Divider textAlign="center" color="grey">
          Today
        </Divider>
      );
    } else {
      return (
        <Divider textAlign="center" color="grey">
          {format(new Date(date), "PPP")}
        </Divider>
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      width={isMobile ? "100vw" : "calc(100vw - 390px)"}
      height="100vh"
    >
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onBack}>
            <ArrowBackIcon />
          </IconButton>
          {otherParticipant && (
            <>
              <Avatar
                alt={otherParticipant.firstName || "User"}
                src={otherParticipant.picturePath || ""}
                style={{ marginRight: "10px" }}
              />
              <Typography variant="h6" component="div">
                {otherParticipant.firstName || "Unknown User"}
              </Typography>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box
        flexGrow={1}
        p="1rem"
        bgcolor="#f5f5f5"
        minHeight="0" // Important to allow proper height calculation
        overflow="auto" // Enable scrolling if needed
        style={{ backgroundColor: neutralLight }}
      >
        <List>
          {messages.map((msg, index) => {
            const prevMessage = messages[index - 1];
            const isNewDay =
              !prevMessage ||
              new Date(prevMessage.createdAt).toDateString() !==
                new Date(msg.createdAt).toDateString();

            return (
              <React.Fragment key={msg._id}>
                {isNewDay && renderDateDivider(msg.createdAt)}
                <ListItem alignItems="flex-start">
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    width="100%"
                    justifyContent={
                      msg.sender._id === userId ? "flex-end" : "flex-start"
                    }
                  >
                    {msg.sender._id !== userId && (
                      <Avatar
                        alt={msg.sender?.firstName || "Unknown"}
                        src={msg.sender?.picturePath || ""}
                        style={{ marginRight: "10px" }}
                      />
                    )}
                    <Paper
                      elevation={2}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor:
                          msg.sender._id === userId ? "lightblue" : "#fff",
                      }}
                    >
                      <Typography variant="body2" color="#000">
                        {msg.content}
                      </Typography>
                      <Typography variant="caption" color="grey">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Paper>
                    {msg.sender._id === userId && (
                      <Avatar
                        alt={msg.sender?.firstName || "Unknown"}
                        src={msg.sender?.picturePath || ""}
                        style={{ marginLeft: "10px" }}
                      />
                    )}
                  </Box>
                </ListItem>
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        padding="1rem"
        bgcolor={background}
        borderTop="1px solid #e0e0e0"
        position="sticky"
        bottom="0"
        left="0"
        width="100%"
        maxWidth="100%"
        boxShadow="0 -1px 10px rgba(0,0,0,0.1)"
        zIndex="1000"
      >
        <IconButton>
          <AttachmentIcon
            sx={{ color: "grey", transform: "rotate(90deg)", fontSize: "25px" }}
          />
        </IconButton>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && message.trim()) {
              handleSendMessage();
            }
          }}
          sx={{ marginRight: "1rem" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatArea;
