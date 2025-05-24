import { Request, Response, NextFunction, RequestHandler } from "express";
export const asyncHandler = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void> | void
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
