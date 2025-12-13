import { config } from './env.js';

export const databaseConfig = {
  url: config.DATABASE_URL,
  logging: config.NODE_ENV === 'development',
};
