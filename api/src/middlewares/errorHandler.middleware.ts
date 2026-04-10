import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import logger from '@/config/logger.config';
import { AppError, ErrorCodes } from '@/utils/app-error';

/**
 * Global error handling middleware for Express applications.
 * @param res
 * @param error
 * @returns
 */
const formatZodError = (res: Response, error: ZodError) => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return res.status(StatusCodes.BAD_REQUEST).json({
    message: 'Validation failed',
    errors,
    errorCode: ErrorCodes.ERROR_BAD_REQUEST,
  });
};

/**
 * Express error handling middleware to catch and format errors consistently across the application.
 * @param error
 * @param req
 * @param res
 * @param _next
 */
export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(`Error occurred on ${req.method} ${req.path}`, error);

  if (error instanceof SyntaxError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid JSON format. Please check your request body.',
    });
  }

  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
  });
};
