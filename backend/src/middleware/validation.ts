import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => {
          const path = err.path.join('.');
          return `${path ? `${path}: ` : ''}${err.message}`;
        });
        
        const error: AppError = new Error(errorMessages.join(', '));
        error.statusCode = 400;
        next(error);
      } else {
        const appError: AppError = new Error('Validation error');
        appError.statusCode = 400;
        next(appError);
      }
    }
  };
};

