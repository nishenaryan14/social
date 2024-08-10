import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import { CreateOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";

const MakeFirstPost = ({ onCreate, isLoggedInUser }) => {
  const theme = useTheme();
  const { palette } = theme;
  const main = palette.primary.main;
  const textSecondary = palette.text.secondary;

  return (
    <Card
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        textAlign: "center",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="center" mb={2}>
          <CreateOutlined sx={{ fontSize: 40, color: main }} />
        </Box>
        {isLoggedInUser ? (
          <>
            <Typography
              variant="h5"
              component="div"
              sx={{ color: main, fontWeight: "bold", mb: 1 }}
            >
              Make Your First Post
            </Typography>
            <Typography variant="body2" sx={{ color: textSecondary, mb: 2 }}>
              Share your thoughts, stories, or updates with your community.
              Click the button below to get started!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onCreate}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: "bold",
              }}
            >
              Create Post
            </Button>
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              component="div"
              sx={{ color: main, fontWeight: "bold", mb: 1 }}
            >
              No Posts Yet
            </Typography>
            <Typography variant="body2" sx={{ color: textSecondary, mb: 2 }}>
              This user hasn’t made any posts yet. Check back later to see their
              updates.
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MakeFirstPost;
