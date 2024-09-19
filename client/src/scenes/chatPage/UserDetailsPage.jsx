import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";

const UserDetailsPage = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const token = useSelector((state) => state.token);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://social-ty3k.onrender.com/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!userDetails) return null;

  return (
    <Box
      width="300px"
      p="1rem"
      borderLeft="1px solid #ddd"
      display="flex"
      flexDirection="column"
    >
      <Avatar
        src={userDetails.picturePath}
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Typography variant="h6">{`${userDetails.firstName} ${userDetails.lastName}`}</Typography>
      <Typography variant="body2">{userDetails.occupation}</Typography>
      <Typography variant="body2">{userDetails.email}</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Send Message
      </Button>
    </Box>
  );
};

export default UserDetailsPage;
