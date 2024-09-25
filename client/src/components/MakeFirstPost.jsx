import { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import MyPostWidget from "../scenes/widgets/MyPostWidget";
import { useSelector } from "react-redux";

const MakeFirstPost = ({ isLoggedInUser }) => {
  const [openModal, setOpenModal] = useState(false);
  const { picturePath } = useSelector((state) => state.user);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <>
      {isLoggedInUser && (
        <Button
          onClick={handleOpen}
          variant="contained"
          sx={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              background: "linear-gradient(45deg, #2575fc, #6a11cb)",
              boxShadow: "0 6px 30px rgba(0,0,0,0.15)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Make Your First Post
        </Button>
      )}

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box
          sx={{
            width: { xs: "90%", md: "40%", lg: "35%" },
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
            p: 2,
            borderRadius: "16px",
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(106, 17, 203, 0.15), rgba(37, 117, 252, 0.15))",
              zIndex: -1,
            },
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            textAlign="center"
            fontWeight="bold"
            gutterBottom
            sx={{
              color: "text.primary",
              fontSize: "1.5rem",
            }}
          >
            Create Your First Post
          </Typography>
          <MyPostWidget picturePath={picturePath} />
        </Box>
      </Modal>
    </>
  );
};

export default MakeFirstPost;
