import { useEffect, useState } from "react";
import io from "socket.io-client";

const useSocket = (token) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:3001", {
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
