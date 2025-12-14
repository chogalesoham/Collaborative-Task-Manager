import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: number;
}

let io: Server;

export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as { userId: number };
      socket.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userId} (socket: ${socket.id})`);

    // Join user's personal room for targeted notifications
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      console.log(`✅ User ${socket.userId} joined room: user:${socket.userId}`);
    }

    socket.on('disconnect', (reason) => {
      console.log(`❌ User disconnected: ${socket.userId} (reason: ${reason})`);
    });
    
    socket.on('error', (error) => {
      console.error(`❌ Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Event emitters
export const emitTaskAssigned = (assigneeId: number, task: any) => {
  if (io) {
    console.log(`📤 Emitting task:assigned to user:${assigneeId}`, { taskId: task.id, taskTitle: task.title });
    io.to(`user:${assigneeId}`).emit('task:assigned', {
      message: 'You have been assigned a new task',
      task,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error('❌ Socket.io not initialized - cannot emit task:assigned');
  }
};

export const emitTaskReassigned = (oldAssigneeId: number | null, newAssigneeId: number, task: any) => {
  if (io) {
    // Notify old assignee (if exists)
    if (oldAssigneeId) {
      io.to(`user:${oldAssigneeId}`).emit('task:unassigned', {
        message: 'A task has been unassigned from you',
        task,
        timestamp: new Date().toISOString(),
      });
    }

    // Notify new assignee
    io.to(`user:${newAssigneeId}`).emit('task:reassigned', {
      message: 'You have been assigned a task',
      task,
      oldAssigneeId,
      newAssigneeId,
      timestamp: new Date().toISOString(),
    });
    
    // Also emit general task:updated to all clients
    io.emit('task:updated', {
      task,
      timestamp: new Date().toISOString(),
    });
  }
};

export const emitTaskUpdated = (task: any) => {
  if (io) {
    console.log(`📤 Broadcasting task:updated`, { taskId: task.id, taskTitle: task.title });
    // Broadcast to all connected clients
    io.emit('task:updated', {
      task,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error('❌ Socket.io not initialized - cannot emit task:updated');
  }
};

export const emitTaskDeleted = (taskId: number) => {
  if (io) {
    console.log(`📤 Broadcasting task:deleted`, { taskId });
    io.emit('task:deleted', {
      taskId,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error('❌ Socket.io not initialized - cannot emit task:deleted');
  }
};

export const emitTaskCreated = (task: any) => {
  if (io) {
    console.log(`📤 Broadcasting task:created`, { taskId: task.id, taskTitle: task.title });
    io.emit('task:created', {
      task,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.error('❌ Socket.io not initialized - cannot emit task:created');
  }
};

/**
 * Emit new notification to specific user
 */
export const emitNewNotification = (userId: number, notification: any) => {
  if (io) {
    console.log(`📤 Emitting notification:new to user:${userId}`, { notificationId: notification.id, type: notification.type });
    io.to(`user:${userId}`).emit('notification:new', notification);
  } else {
    console.error('❌ Socket.io not initialized - cannot emit notification:new');
  }
};
