import { fromNodeHeaders } from 'better-auth/node';
import { NextFunction, Request, Response } from 'express';

import auth from '@/lib/auth';
import { UnauthorizedException } from '@/utils/app-error';

/**
 * Middleware to require authentication for protected routes.
 * It checks for a valid session and attaches the user information to the request object.
 * @param req The Express request object.
 * @param res The Express response object.
 * @param next The next middleware function in the stack.
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authInstance = auth();

  const session = await authInstance.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new UnauthorizedException('Unauthorized, Please sign in');
  }

  req.user = session.user;
  req.session = session;

  next();
};
