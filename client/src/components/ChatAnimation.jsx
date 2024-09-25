import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { Message } from "@mui/icons-material";

const ChatAnimation = ({ isVisible, onClose, onAnimationComplete }) => {
  const [show, setShow] = useState(isVisible);
  const theme = useTheme();

  // Determine background color based on theme mode
  const alt = theme.palette.background.alt; // Use the alternative background color from the theme
  const overlayColor =
    theme.palette.mode === "dark"
      ? "rgba(0, 0, 0, 0.5)" // Slightly transparent black for dark mode (less dim)
      : "rgba(0, 0, 0, 0.7)"; // Semi-transparent black for light mode

  const iconColor =
    theme.palette.mode === "dark"
      ? "primary.main" // Default primary color for dark mode (no dim)
      : "primary.main"; // Default primary color for light mode

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
    <>
      {isVisible && (
        // Background overlay to make the animation stand out
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: overlayColor, // Updated for dark mode
            zIndex: 999, // Ensure the overlay is behind the animation
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Animation Box */}
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: show
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0)",
              opacity: show ? 1 : 0,
              backgroundColor: alt, // Background color for the animation
              borderRadius: "50%",
              width: "120px", // Slightly larger to make it more visible
              height: "120px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.4)", // Enhanced shadow for more depth
              transition: "transform 1.5s ease, opacity 1.5s ease",
              zIndex: 1000, // Animation is on top
            }}
          >
            <Message sx={{ fontSize: "48px", color: iconColor }} />{" "}
            {/* Icon color remains bright */}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ChatAnimation;
