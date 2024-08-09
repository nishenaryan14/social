import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useInView } from "react-intersection-observer";
import EmojiPicker from "emoji-picker-react";

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
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setNewComment((prevComment) => prevComment + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

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
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      {isLoading ? (
        // Loading skeletons here...
        <Box>Loading...</Box>
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
            <img
              ref={imageRef}
              width="100%"
              height="auto"
              alt="post"
              style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
              src={inView ? picturePath : undefined}
              loading="lazy"
            />
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
                <Typography>{likeCount}</Typography>
              </FlexBetween>

              <FlexBetween gap="0.3rem">
                <IconButton onClick={() => setIsComments(!isComments)}>
                  <ChatBubbleOutlineOutlined />
                </IconButton>
                <Typography>{comments.length}</Typography>
              </FlexBetween>
            </FlexBetween>

            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>
          {isComments && (
            <Box mt="0.5rem">
              {comments.map((comment, i) => (
                <Box key={`${comment.userId}-${i}`} sx={{ mb: "0.5rem" }}>
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: "0.5rem 1rem",
                    }}
                  >
                    <Typography
                      sx={{
                        color: primary,
                        fontWeight: "bold",
                        mr: "0.5rem",
                      }}
                    >
                      {comment.userName}
                    </Typography>
                    <Typography sx={{ color: main, lineHeight: 1.5 }}>
                      {comment.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Divider />
              <Box mt="1rem" display="flex" gap="1rem" alignItems="center">
                <TextField
                  variant="outlined"
                  placeholder="Add a comment..."
                  fullWidth
                  size="small"
                  value={newComment}
                  onChange={handleCommentChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  😊
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCommentSubmit}
                >
                  Post
                </Button>
              </Box>
              {showEmojiPicker && (
                <Box mt="1rem">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Box>
              )}
            </Box>
          )}
        </>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
