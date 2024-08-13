import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { EmojiEmotions } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";

export const CommentWidget = ({
  comments,
  newComment,
  handleCommentChange,
  handleCommentSubmit,
  showEmojiPicker,
  setShowEmojiPicker,
}) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const handleEmojiClick = (event, emojiObject) => {
    console.log(emojiObject?.emoji);
    handleCommentChange({ target: { value: newComment + emojiObject?.emoji } });
    setShowEmojiPicker(false);
  };

  return (
    <Box
      mt="0.5rem"
      sx={{
        backgroundColor: palette.background.default,
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}
    >
      {comments.map((comment, i) => (
        <Box key={`${comment.userId}-${i}`} sx={{ mb: "0.5rem" }}>
          <Divider />
          <Box sx={{ display: "flex", alignItems: "center", p: "0.5rem 1rem" }}>
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  edge="start"
                >
                  <EmojiEmotions />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Post
        </Button>
      </Box>
      {showEmojiPicker && (
        <Box
          mt="1rem"
          sx={{
            position: "absolute",
            bottom: "100%", // Position above the input field
            left: 0,
            zIndex: 10,
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Box>
      )}
    </Box>
  );
};
