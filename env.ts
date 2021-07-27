import dotenv from 'dotenv';
dotenv.config();

export const  QUEUE_NAME = process.env.QUEUE_NAME;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_DATABASE = process.env.REDIS_DATABASE;
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
