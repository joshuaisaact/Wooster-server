import { mockUser } from '../helpers/auth-mocks';
import { Request, Response, NextFunction } from 'express';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  req.user = mockUser;
  next();
};
