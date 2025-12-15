import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import prisma from './lib/prisma.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { initializeSocket } from './lib/socket.js';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

initializeSocket(server);

// CORS must specify exact origin when credentials are enabled (not wildcard)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);


app.use('/', routes);
app.use(errorHandler);

server.listen(PORT, async () => {
  console.log(`Server Start at: ${PORT}`);
  
  try {
    await prisma.$connect();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
});

// Graceful shutdown: cleanup resources before process termination
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});

export default app;
