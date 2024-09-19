import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setConversations } from "../../state";
import ChatList from "./ChatList";
import ChatArea from "./ChatArea";
import UserDetailsPage from "./UserDetailsPage";
import useSocket from "../../utils/socket";
import ChatSearchPage from "./SearchPage";

const ChatPage = () => {
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const conversations = useSelector((state) => state.conversations);
  const socket = useSocket(token);

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
        console.log(data);
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

  // Listen for real-time updates via socket
  useEffect(() => {
    fetchConversations();
    if (socket) {
      socket.on("message", (message) => {
        // Update conversation with the latest message
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
        // Add new conversation to the list
        dispatch(
          setConversations((prevConversations) => [
            ...prevConversations,
            conversation,
          ])
        );
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        socket.off("message"); // Clean up the event listener
        socket.off("newConversation");
        socket.off("disconnect");
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
    <>
      <Box display="flex" overflow="hidden">
        {showSearch && (
          <ChatSearchPage onSearchResultClick={handleUserSelect} />
        )}
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
      </Box>
    </>
  );
};

export default ChatPage;
