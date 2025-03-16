import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin"; 
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}

const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      username: string;
      role: string;
    };

    let user = null;
    if (decoded.role === "Admin") {
      user = await Admin.findById(decoded.id);
    } else if (decoded.role === "Worker 1" || decoded.role === "Worker 2") {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

export default authenticateJWT;
