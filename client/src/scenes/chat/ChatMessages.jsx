import { Box, Typography } from "@mui/material";

const ChatMessages = ({ messages, neutralLight, dark }) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "scroll",
        padding: "1rem",
        backgroundColor: neutralLight,
      }}
    >
      {messages.map((msg, index) => (
        <Box
          key={index}
          sx={{
            marginBottom: "1rem",
            padding: "0.5rem",
            borderRadius: "8px",
            backgroundColor: msg.sender === "User" ? dark : neutralLight,
            color: msg.sender === "User" ? "white" : dark,
            alignSelf: msg.sender === "User" ? "flex-end" : "flex-start",
          }}
        >
          <Typography>{msg.text}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ChatMessages;
