import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.errors.map((e) => {
          const path = e.path.join('.');
          return `${path ? `${path}: ` : ''}${e.message}`;
        });
        
        const appError: AppError = new Error(errorMessages.join(', '));
        appError.statusCode = 400;
        next(appError);
      } else {
        const appError: AppError = new Error('Validation error');
        appError.statusCode = 400;
        next(appError);
      }
    }
  };
};

