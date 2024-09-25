import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import "../../index.css";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, removePost } from "state"; // Assuming removePost action exists
import { useInView } from "react-intersection-observer";
import { CommentWidget } from "./CommentWidget";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isLoading,
  isProfile,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [heartVisible, setHeartVisible] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for dialog
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const { ref: imageRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Patch like function
  const patchLike = async () => {
    const response = await fetch(
      `https://social-ty3k.onrender.com/posts/${postId}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    // Trigger heart animation
    setHeartVisible(true);
    setTimeout(() => setHeartVisible(false), 1000); // Hide heart after 1 second
  };

  // Delete post logic
  const handleDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Dispatch action to remove post from state
      dispatch(removePost({ postId }));
      toast.success("Post deleted successfully!"); // Success toast
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post!"); // Error toast
    }
    setOpenDeleteDialog(false); // Close dialog after deleting
  };

  // Handle comment input change
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(
        `https://social-ty3k.onrender.com/posts/${postId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: loggedInUserId,
            comment: newComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Open delete dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <WidgetWrapper m="2rem 0">
      {isLoading ? (
        <>
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            sx={{ mt: 1 }}
          />
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={60} />
            </FlexBetween>
            <Skeleton variant="circular" width={40} height={40} />
          </FlexBetween>
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        </>
      ) : (
        <>
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
            isProfile={isProfile}
          />
          <Typography color={main} sx={{ mt: "1rem" }}>
            {description}
          </Typography>
          {picturePath && (
            <Box position="relative">
              <img
                ref={imageRef}
                width="100%"
                height="auto"
                alt="post"
                style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                src={inView ? picturePath : undefined}
                onDoubleClick={patchLike}
                loading="lazy"
              />
              {heartVisible && isLiked && (
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  sx={{
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    pointerEvents: "none",
                  }}
                >
                  <FavoriteOutlined
                    sx={{
                      color: primary,
                      fontSize: "3rem",
                      animation: "pulse 1s ease-out",
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <FlexBetween gap="0.3rem">
                <IconButton onClick={patchLike}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: primary }} />
                  ) : (
                    <FavoriteBorderOutlined />
                  )}
                </IconButton>
                <Typography>{likeCount} likes</Typography>
              </FlexBetween>

              <FlexBetween gap="0.3rem">
                <IconButton onClick={() => setIsComments(!isComments)}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>
                  {comments.length}{" "}
                  {comments.length < 2 ? "comment" : "comments"}
                </Typography>
              </FlexBetween>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              {postUserId === loggedInUserId && (
                <IconButton onClick={handleOpenDeleteDialog}>
                  <DeleteOutline />
                </IconButton>
              )}
              <IconButton>
                <ShareOutlined />
              </IconButton>
            </FlexBetween>
          </FlexBetween>
          {isComments && (
            <CommentWidget
              comments={comments}
              newComment={newComment}
              handleCommentChange={handleCommentChange}
              handleCommentSubmit={handleCommentSubmit}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
            />
          )}

          {/* Delete confirmation dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="delete-dialog-title"
          >
            <DialogTitle id="delete-dialog-title">Delete Post</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDeletePost} color="secondary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
