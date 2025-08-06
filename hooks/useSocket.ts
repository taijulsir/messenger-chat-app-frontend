import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Replace with your backend URL

const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Initialize the socket connection
    const socketConnection = io(SOCKET_URL);

    setSocket(socketConnection);

    // Cleanup on component unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
