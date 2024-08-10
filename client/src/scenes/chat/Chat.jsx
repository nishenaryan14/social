import { useState } from "react";
import ChatContainer from "./ChatContainer";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import { useTheme } from "@mui/material";

const Chat = () => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.dark;
  const alt = theme.palette.background.alt;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: "User", text: message }]);
      setMessage("");
    }
  };

  return (
    <ChatContainer background={background}>
      <ChatHeader
        chatName="Chat Room"
        primaryLight={primaryLight}
        color={background}
      />
      <ChatMessages
        messages={messages}
        primaryLight={primaryLight}
        neutralLight={neutralLight}
        dark={dark}
      />
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={handleSend}
        background={background}
        dark={dark}
      />
    </ChatContainer>
  );
};

export default Chat;
