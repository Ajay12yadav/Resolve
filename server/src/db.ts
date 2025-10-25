import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Test database connection
prisma.$connect()
  .then(() => console.log('Database connected successfully'))
  .catch((error) => console.error('Database connection failed:', error));