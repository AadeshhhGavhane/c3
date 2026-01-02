import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No token provided. Authorization header required.',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = verifyToken(token);
      
      // Verify user still exists
      const user = await User.findById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not found. Token invalid.',
        });
        return;
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (tokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

