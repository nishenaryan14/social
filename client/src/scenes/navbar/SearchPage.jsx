import { useState, useEffect, useCallback } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  useTheme,
} from "@mui/material";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";

const SearchPage = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  setSearchResults,
  onSearchResultClick,
}) => {
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;

  // State to track if a search operation has been performed at least once
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch search results with debounced input to avoid excessive API calls
  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      if (query.length > 2) {
        // Ensure the query is meaningful (more than 2 characters)
        try {
          const response = await fetch(
            `https://social-ty3k.onrender.com/users?name=${query}`,
            // `http://localhost:3001/users?name=${query}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Authorization with token from Redux store
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`); // Error handling
          }
          console.log(token);
          const data = await response.json();
          setSearchResults(data); // Update the search results state
        } catch (error) {
          console.error("Error fetching search results:", error); // Log any fetch errors
        }
      } else {
        setSearchResults([]); // Clear results if query length is insufficient
      }
    }, 300), // Debounce with a 300ms delay
    [token, setSearchResults] // Dependencies for useCallback
  );

  useEffect(() => {
    if (searchQuery.length > 2) {
      setHasSearched(true); // Indicate that a search has been executed
      fetchSearchResults(searchQuery); // Fetch search results based on query
    } else {
      setSearchResults([]); // Clear search results if query length is insufficient
    }
  }, [searchQuery, fetchSearchResults]); // Dependencies for useEffect

  return (
    <Box
      backgroundColor={alt} // Background color from theme
      borderRadius="9px" // Rounded corners
      maxHeight="400px" // Max height for scrollable area
      overflow="auto" // Enable scrolling if content exceeds max height
      p="1rem" // Padding
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)" // Box shadow for subtle elevation
      sx={{ position: "relative", zIndex: "9999" }} // Positioning and z-index to ensure the component overlays correctly
    >
      {searchResults.length > 0 ? ( // Check if there are results to display
        <List>
          {searchResults.map((result) => (
            <ListItem
              key={result._id}
              alignItems="flex-start"
              onClick={() => onSearchResultClick(result._id)} // Handle click on a result
              sx={{ cursor: "pointer" }} // Pointer cursor to indicate clickable items
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: primaryLight, // Avatar background color from theme
                    color: primaryDark, // Text color from theme
                    width: "35px",
                    height: "35px",
                    fontSize: "1.25rem",
                  }}
                  alt={`${result.firstName} ${result.lastName}`.toUpperCase()} // Alt text for accessibility
                  src={result.picturePath} // Avatar image source
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${result.firstName} ${result.lastName}`} // Primary text (user's full name)
                secondary={result.occupation} // Secondary text (user's occupation)
              />
            </ListItem>
          ))}
        </List>
      ) : (
        hasSearched && ( // Show "No results found" message if search has been executed but no results
          <Box textAlign="center" p="1rem">
            No results found.
          </Box>
        )
      )}
    </Box>
  );
};

export default SearchPage;
