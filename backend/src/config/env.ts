import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
} as const;

export const validateEnv = () => {
  if (!config.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in environment variables');
  }
};
