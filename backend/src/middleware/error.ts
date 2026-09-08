import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { errorResponse } from '../utils/response';
import { env } from '../config/env';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json(errorResponse('Validation Error', err.issues));
      }
      next(err);
    }
  };
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any[] | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.issues;
  } else if (err.name === 'ValidationError') {
    // Mongoose Validation Error
    statusCode = 400;
    message = 'Database Validation Error';
    errors = Object.values(err.errors).map((val: any) => val.message);
  } else if (err.code === 11000) {
    // MongoDB Duplicate Key Error
    statusCode = 409;
    message = 'Duplicate Resource Error';
    errors = [err.keyValue];
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // Log error in development or if it's a 500
  if (env.NODE_ENV === 'development' || statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json(
    errorResponse(
      message,
      errors || (env.NODE_ENV === 'development' && statusCode === 500 ? [err.message] : undefined)
    )
  );
};
