import {Request} from "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
    }
    interface Request {
      user?: User;
      files?: {
        avatar?: Express.Multer.File[];
        [key: string]: Express.Multer.File[] | undefined;
      };
    }
  }
}
