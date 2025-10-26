import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};