import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
const SearchPage = ({
  token,
  searchQuery,
  searchResults,
  setSearchResults,
  onSearchResultClick,
}) => {
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim()) {
        try {
          const response = await fetch(
            `https://social-ty3k.onrender.com/users?name=${searchQuery}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to search users");
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
    };

    fetchSearchResults();
  }, [searchQuery, setSearchResults]);

  return (
    <Box sx={{ maxHeight: "300px", overflowY: "auto", zIndex: "10" }}>
      {searchQuery.trim() && !searchResults.length ? (
        <CircularProgress />
      ) : searchResults.length > 0 ? (
        <List>
          {searchResults.map((user) => (
            <ListItem
              button
              key={user._id}
              onClick={() => onSearchResultClick(user._id)}
            >
              <ListItemText primary={user.firstName} secondary={user.email} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{ textAlign: "center", padding: "1rem" }}>
          No users found.
        </Typography>
      )}
    </Box>
  );
};

export default SearchPage;
