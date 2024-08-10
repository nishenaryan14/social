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
  // State to keep track of whether the search has been executed at least once
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSearchResults = useCallback(
    debounce(async (query) => {
      if (query.length > 2) {
        try {
          const response = await fetch(
            `https://social-ty3k.onrender.com/users?name=${query}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data = await response.json();
          setSearchResults(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    [token, setSearchResults]
  );

  useEffect(() => {
    if (searchQuery.length > 2) {
      setHasSearched(true);
      fetchSearchResults(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, fetchSearchResults]);

  return (
    <Box
      backgroundColor={alt}
      borderRadius="9px"
      maxHeight="400px"
      overflow="auto"
      p="1rem"
      boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
      sx={{ position: "relative", zIndex: "9999" }}
    >
      {searchResults.length > 0 ? (
        <List>
          {searchResults.map((result) => (
            <ListItem
              key={result._id}
              alignItems="flex-start"
              onClick={() => onSearchResultClick(result._id)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: primaryLight,
                    color: primaryDark,
                    width: "35px",
                    height: "35px",
                    fontSize: "1.25rem",
                  }}
                  alt={`${result.firstName} ${result.lastName}`.toUpperCase()}
                  src={result.picturePath}
                />
              </ListItemAvatar>
              <ListItemText
                primary={`${result.firstName} ${result.lastName}`}
                secondary={result.occupation}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        hasSearched && (
          <Box textAlign="center" p="1rem">
            No results found.
          </Box>
        )
      )}
    </Box>
  );
};

export default SearchPage;
