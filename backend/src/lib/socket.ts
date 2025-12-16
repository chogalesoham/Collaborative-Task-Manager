import { Server as HTTPServer } from 'http'
import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'

interface AuthenticatedSocket extends Socket {
  userId?: number
}

let io: Server

export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  })

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication error'))
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
      const decoded = jwt.verify(token, jwtSecret) as { userId: number }
      socket.userId = decoded.userId
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    // Join user-specific room for targeted notifications
    if (socket.userId) {
      socket.join(`user:${socket.userId}`)
    }
  })

  return io
}

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized')
  }
  return io
}

// Event emitters
export const emitTaskAssigned = (assigneeId: number, task: any) => {
  if (io) {
    io.to(`user:${assigneeId}`).emit('task:assigned', {
      message: 'You have been assigned a new task',
      task,
      timestamp: new Date().toISOString(),
    })
  }
}

export const emitTaskReassigned = (
  oldAssigneeId: number | null,
  newAssigneeId: number,
  task: any,
) => {
  if (io) {
    if (oldAssigneeId) {
      io.to(`user:${oldAssigneeId}`).emit('task:unassigned', {
        message: 'A task has been unassigned from you',
        task,
        timestamp: new Date().toISOString(),
      })
    }

    io.to(`user:${newAssigneeId}`).emit('task:reassigned', {
      message: 'You have been assigned a task',
      task,
      oldAssigneeId,
      newAssigneeId,
      timestamp: new Date().toISOString(),
    })

    io.emit('task:updated', {
      task,
      timestamp: new Date().toISOString(),
    })
  }
}

export const emitTaskUpdated = (task: any) => {
  if (io) {
    io.emit('task:updated', {
      task,
      timestamp: new Date().toISOString(),
    })
  }
}

export const emitTaskDeleted = (taskId: number) => {
  if (io) {
    io.emit('task:deleted', {
      taskId,
      timestamp: new Date().toISOString(),
    })
  }
}

export const emitTaskCreated = (task: any) => {
  if (io) {
    io.emit('task:created', {
      task,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Emit new notification to specific user
 */
export const emitNewNotification = (userId: number, notification: any) => {
  if (io) {
    io.to(`user:${userId}`).emit('notification:new', notification)
  }
}
