import { Box } from "@mui/material";

const ChatContainer = ({ children, background }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: background,
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      {children}
    </Box>
  );
};

export default ChatContainer;
