import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setConversations } from "../../state";
import ChatList from "./ChatList";
import ChatArea from "./ChatArea";
import UserDetailsPage from "./UserDetailsPage";
import useSocket from "../../utils/socket";
import ChatSearchPage from "./SearchPage";
import { useTheme } from "@mui/material/styles";

const ChatPage = () => {
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const conversations = useSelector((state) => state.conversations);
  const socket = useSocket(token);
  const theme = useTheme();

  // Use useMediaQuery to detect if it's mobile
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // 'sm' is 600px by default

  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch(
        "https://social-ty3k.onrender.com/chats/conversations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch conversations");
      const data = await response.json();
      dispatch(setConversations({ conversations: data }));
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [dispatch, token]);

  const handleUserSelect = useCallback(
    async (userId) => {
      try {
        const response = await fetch(
          "https://social-ty3k.onrender.com/chats/create-conversation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
          }
        );
        if (!response.ok) throw new Error("Failed to create conversation");
        const data = await response.json();
        setSelectedChat(data);
        setUserDetails(null);
        fetchConversations();
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    },
    [token, fetchConversations]
  );

  const handleViewUserDetails = (userId) => {
    const user = conversations.find((chat) =>
      chat.participants.some((participant) => participant._id === userId)
    );
    setUserDetails(user);
  };

  useEffect(() => {
    fetchConversations();
    if (socket) {
      socket.on("message", (message) => {
        dispatch(
          setConversations((prevConversations) =>
            prevConversations.map((chat) =>
              chat._id === message.roomId
                ? { ...chat, lastMessage: message }
                : chat
            )
          )
        );
      });

      // Listen for a new conversation
      socket.on("newConversation", (conversation) => {
        dispatch(
          setConversations((prevConversations) => [
            ...prevConversations,
            conversation,
          ])
        );
      });

      return () => {
        socket.off("message"); // Clean up the event listener
        socket.off("newConversation");
      };
    }
  }, [fetchConversations, socket, dispatch]);

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const onBack = () => {
    setSelectedChat(null);
  };

  return (
    <Box display="flex" overflow="hidden" height="100vh">
      {isMobile ? (
        <>
          {!selectedChat ? (
            <ChatList
              conversations={conversations}
              onSelectChat={setSelectedChat}
              onViewUserDetails={handleViewUserDetails}
              selectedChat={selectedChat}
              onSearchUser={handleUserSelect}
              onSearchClick={handleSearchClick}
            />
          ) : (
            <ChatArea
              selectedChat={selectedChat}
              token={token}
              onBack={onBack}
            />
          )}
        </>
      ) : (
        <>
          <ChatList
            conversations={conversations}
            onSelectChat={setSelectedChat}
            onViewUserDetails={handleViewUserDetails}
            selectedChat={selectedChat}
            onSearchUser={handleUserSelect}
            onSearchClick={handleSearchClick}
          />
          <Box flexGrow={1} display="flex" flexDirection="column">
            {selectedChat ? (
              <ChatArea
                selectedChat={selectedChat}
                token={token}
                onBack={onBack}
              />
            ) : (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexGrow={1}
              >
                <Typography variant="h5">
                  Select a chat to start messaging
                </Typography>
              </Box>
            )}
          </Box>
          {userDetails && <UserDetailsPage userId={userDetails._id} />}
        </>
      )}
    </Box>
  );
};

export default ChatPage;
