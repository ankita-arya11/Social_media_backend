import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwt';
import db from '../models';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized User' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await db.User.findOne({
      where: {
        email: decoded?.email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
