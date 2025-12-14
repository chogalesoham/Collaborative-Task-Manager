import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket?.connected) {
    return socket;
  }

  const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    autoConnect: true,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket.io connected', { socketId: socket?.id });
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket.io disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket.io connection error:', error.message);
  });
  
  socket.on('error', (error) => {
    console.error('❌ Socket.io error:', error);
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket.io disconnected manually');
  }
};
