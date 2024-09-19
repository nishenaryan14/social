import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  ClickAwayListener,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import SearchPage from "./SearchPage";

const ChatList = ({
  conversations,
  onSelectChat,
  onViewUserDetails,
  selectedChat,
  onSearchUser, // New prop to handle user search result click
}) => {
  const { _id: currentUserId } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const theme = useTheme();
  const handleSearchInputChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      try {
        const response = await fetch(
          `https://social-ty3k.onrender.com/users/?name=${e.target.value}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setIsSearchBarVisible(true);
    } else {
      setIsSearchBarVisible(false);
    }
  };

  const handleClick = (chat) => {
    onSelectChat(chat);
    const otherUser = chat.participants.find(
      (participant) => participant._id !== currentUserId
    );
    if (otherUser) {
      onViewUserDetails(otherUser._id);
    }
  };

  return (
    <Box
      width="300px"
      height="100vh"
      borderRight="1px solid #ddd"
      sx={{ overflowY: "scroll" }}
    >
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontFamily: '"Dancing Script", cursive' }}
          >
            Messenger
          </Typography>
        </Toolbar>
      </AppBar>

      <Box display="flex" alignItems="center" padding="8px">
        <InputBase
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          sx={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            backgroundColor: "neutralLight",
          }}
          startAdornment={<SearchIcon />}
        />
      </Box>

      {isSearchBarVisible && (
        <ClickAwayListener onClickAway={() => setIsSearchBarVisible(false)}>
          <Box position="relative" zIndex="30" backgroundColor="#fff">
            <SearchPage
              token={token}
              searchQuery={searchQuery}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              onSearchResultClick={(id) => {
                onSearchUser(id);
                setIsSearchBarVisible(false);
              }}
            />
          </Box>
        </ClickAwayListener>
      )}

      <List>
        {conversations.map((chat) => {
          const otherParticipant = chat.participants.find(
            (participant) => participant._id !== currentUserId
          );

          if (!otherParticipant) {
            return null;
          }

          return (
            <ListItem
              key={chat._id}
              button
              selected={selectedChat?._id === chat._id}
              onClick={() => handleClick(chat)}
            >
              <ListItemAvatar>
                <Avatar>
                  {otherParticipant.picturePath ? (
                    <img
                      src={otherParticipant.picturePath}
                      alt={otherParticipant.firstName || "User"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    otherParticipant.firstName?.charAt(0) || "U"
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={otherParticipant.firstName || "Unknown User"}
                secondary={chat.lastMessage?.content || "No messages yet"}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default ChatList;
