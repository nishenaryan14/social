import { Box, InputBase, IconButton } from "@mui/material";
import { Send } from "@mui/icons-material";

const MessageInput = ({ message, setMessage, onSend, background, dark }) => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "0.5rem",
        backgroundColor: background,
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        alignItems: "center",
      }}
    >
      <InputBase
        sx={{
          flex: 1,
          marginRight: "0.5rem",
          backgroundColor: dark,
          color: "white",
          borderRadius: "4px",
          padding: "0.5rem",
        }}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <IconButton color="primary" onClick={onSend}>
        <Send />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
