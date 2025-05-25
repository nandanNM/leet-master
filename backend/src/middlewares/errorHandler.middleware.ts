import type { Request, Response, NextFunction } from "express";
import { ApiError, errorResponse } from "../utils/responses";

export function errorHandler(err: unknown, req: Request, res: Response): void {
  // Handle different error types
  if (err instanceof ApiError) {
    errorResponse(res, err);
  } else if (err instanceof Error) {
    errorResponse(
      res,
      new ApiError(
        500,
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : err.message,
        "INTERNAL_ERROR",
        process.env.NODE_ENV === "development" ? [err.stack || ""] : []
      )
    );
  } else {
    errorResponse(
      res,
      new ApiError(500, "Internal Server Error", "UNKNOWN_ERROR")
    );
  }
}
