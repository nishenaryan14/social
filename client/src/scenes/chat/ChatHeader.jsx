import { Box, Typography } from "@mui/material";

const ChatHeader = ({ chatName, color, primaryLight }) => {
  return (
    <Box
      sx={{
        padding: "1rem",
        backgroundColor: color,
        color: primaryLight,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    >
      <Typography variant="h6">{chatName}</Typography>
    </Box>
  );
};

export default ChatHeader;
