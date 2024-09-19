import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = (token) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = io("https://social-ty3k.onrender.com", {
        query: { token },
      });
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  return socket;
};

export default useSocket;
