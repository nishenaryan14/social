import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { Message } from "@mui/icons-material";

const ChatAnimation = ({ isVisible, onClose, onAnimationComplete }) => {
  const [show, setShow] = useState(isVisible);
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        onAnimationComplete(); // Call the navigation function here
        onClose();
      }, 1500); // Close after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, onAnimationComplete]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: show
          ? "translate(-50%, -50%) scale(1)"
          : "translate(-50%, -50%) scale(0)",
        opacity: show ? 1 : 0,
        backgroundColor: { alt },
        borderRadius: "50%",
        width: "100px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        transition: "transform 1.5s ease, opacity 1.5s ease",
        zIndex: 1000,
      }}
    >
      <Message sx={{ fontSize: "40px", color: "primary.main" }} />
    </Box>
  );
};

export default ChatAnimation;
