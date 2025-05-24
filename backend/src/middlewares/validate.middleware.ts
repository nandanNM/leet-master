import type { Request, Response, NextFunction, RequestHandler } from "express";
import { errorResponse, ApiError } from "../utils/responses";
import { ZodSchema, ZodError } from "zod";

export const validate = <T>(schema: ZodSchema<T>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      errorResponse(
        res,
        new ApiError(
          400,
          "Validation failed",
          "VALIDATION_ERROR",
          result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`)
        )
      );
    }
    // req.validatedData = result.data;
    next();
  };
};
