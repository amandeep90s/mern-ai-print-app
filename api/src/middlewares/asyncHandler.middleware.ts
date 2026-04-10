import { NextFunction, Request, Response } from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;

/**
 * A middleware to handle async controllers and catch errors without the need for try-catch blocks in each controller.
 * @param controller The async controller function to be wrapped.
 * @returns A new controller function that handles errors.
 */
export const asyncHandler =
  (controller: AsyncController) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
  };
