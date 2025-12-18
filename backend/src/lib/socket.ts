import { Server } from 'socket.io'

// Singleton pattern for Socket.IO instance
// This avoids circular dependency issues
let ioInstance: Server | null = null

export const setIo = (io: Server) => {
  ioInstance = io
}

export const getIo = (): Server | null => {
  return ioInstance
}

