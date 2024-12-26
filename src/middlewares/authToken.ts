import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwt';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
