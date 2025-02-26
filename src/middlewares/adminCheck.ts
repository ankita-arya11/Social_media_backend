import { NextFunction, Request, Response } from 'express';

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const user = (req as any).user;

  if (!user || user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  next();
};
