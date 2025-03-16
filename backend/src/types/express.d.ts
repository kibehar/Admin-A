import { IUser } from "../models/User"; 
import { IAdmin } from "../models/Admin"; 

declare global {
  namespace Express {
    export interface Request {
      admin?: { id: string; firstName: string; lastName: string; email: string; username: string };
      user?: IUser | IAdmin; 
    }
  }
}
