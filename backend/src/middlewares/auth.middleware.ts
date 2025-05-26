import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {db} from "../db";
import {ApiResponse, ApiError, errorResponse} from "../utils/responses";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies["leet-master-token"];
    if (!token) {
      throw new ApiError(401, "Unauthorized Access", "MISSING_TOKEN");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || typeof decoded === "string") {
      throw new ApiError(401, "Unauthorized Access", "INVALID_TOKEN");
    }

    const {id, email} = decoded as jwt.JwtPayload;
    const user = await db.query.usersTable.findFirst({
      where: (usersTable, {eq}) => eq(usersTable.email, email),
      columns: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Unauthorized Access", "USER_NOT_FOUND");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      errorResponse(res, new ApiError(401, "Token expired", "TOKEN_EXPIRED"));
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorResponse(res, new ApiError(401, "Invalid token", "INVALID_TOKEN"));
    } else {
      errorResponse(res, error);
    }
  }
};

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Unauthorized Access", "MISSING_USER_CONTEXT");
    }
    if (user.role !== "ADMIN") {
      throw new ApiError(403, "Access denied - Admins only", "ADMIN_REQUIRED");
    }
    next();
  } catch (error) {
    errorResponse(res, error);
  }
};
