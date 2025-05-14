import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodSchema } from "zod";

export const validate = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ success: false, errors: result.error.errors });
    } else {
      next();
    }
  };
};
