import {fromNodeHeaders} from "better-auth/node";
import {NextFunction, Request, Response} from "express";
import {auth} from "../config/auth.config";
import {asyncHandler} from "../utils/async-handler.utils";
import {ApiError} from "../utils/responses.utils";

export const requireRole = (allowedRoles: string[]) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session) {
        throw new ApiError(
          401,
          "Unauthorized - Please login to continue",
          "UNAUTHORIZED",
        );
      }

      const userRole = (session.user as any).role!;
      if (!allowedRoles.includes(userRole)) {
        throw new ApiError(403, "Forbidden", "FORBIDDEN");
      }

      // Attach session and user to request
      req.session = session.session;
      req.user = session.user;

      next();
    },
  );
};

export const requireAdmin = requireRole(["admin"]);
export const requireAnyAuth = requireRole(["admin", "user"]);
