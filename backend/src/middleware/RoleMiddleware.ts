import { Request, Response, NextFunction } from 'express';

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(403).json({ message: 'No user found' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' });
    }

    next();
  };
};
