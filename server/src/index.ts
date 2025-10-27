import * as dotenv from 'dotenv';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import complaintsRoutes from './routes/complaints';

// Initialize Prisma
const prisma = new PrismaClient({
  errorFormat: 'minimal',
  log: ['error', 'warn']
});

// Initialize Express
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://resolvefrontend.vercel.app',
    'https://resolvefrontend-n0ts76boc-ajay-yadavs-projects-fd057fd7.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintsRoutes);

// Health check
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Resolve API is running' });
});

export default app;