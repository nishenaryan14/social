import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const ChatMessage = ({ message, isSent }) => {
  return (
    <Box
      display="flex"
      justifyContent={isSent ? "flex-end" : "flex-start"}
      mb={2}
    >
      {!isSent && <Avatar src={message.sender.picturePath} />}
      <Box
        bgcolor={isSent ? "primary.main" : "grey.300"}
        color={isSent ? "white" : "black"}
        borderRadius={2}
        p={1}
        maxWidth="70%"
      >
        <Typography variant="body1">{message.content}</Typography>
      </Box>
    </Box>
  );
};

export default ChatMessage;
