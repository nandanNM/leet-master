import {Request} from "express";
import {Session, User} from "better-auth";

declare global {
  namespace Express {
    interface Request {
      session?: Session;
      user?: User;
      files?: {
        avatar?: Express.Multer.File[];
        [key: string]: Express.Multer.File[] | undefined;
      };
    }
  }
}
