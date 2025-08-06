import { io } from 'socket.io-client';

let socket: any;

if (typeof window !== 'undefined') {  // Ensure the code runs only on the client-side
  const user = localStorage.getItem("user");

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const parsedUser = JSON.parse(user);

  if (!parsedUser.token) {
    throw new Error("Token not found in the user data");
  }

  // Initialize Socket.IO client with the token
  socket = io('http://localhost:5012', {
    query: { token: parsedUser.token },
    transports: ['websocket'],  // Use WebSocket for faster communication
  });
  
}

export default socket;
