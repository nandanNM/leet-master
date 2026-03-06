import { Response } from "express";

interface ApiResponseBody<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T | null;
  error?: { code?: string; details?: string[] } | null;
}

export class ApiResponse<T = any> {
  constructor(
    public readonly statusCode: number,
    public readonly message: string = "🎉 Success!",
    public readonly data: T | null = null
  ) {}

  send(res: Response): Response {
    const body: ApiResponseBody<T> = {
      statusCode: this.statusCode,
      success: this.statusCode >= 200 && this.statusCode < 400,
      message: this.message,
      data: this.data,
      error: null,
    };
    return res.status(this.statusCode).json(body);
  }
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errorCode?: string,
    public readonly details: string[] = [],
    public readonly isOperational: boolean = true
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorResponse(res: Response, error: unknown): Response {
  const err =
    error instanceof ApiError
      ? error
      : new ApiError(500, "Internal server error", "INTERNAL_ERROR");

  console.error(`[ERROR] ${err.statusCode} ${err.message}`, {
    code: err.errorCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  const body: ApiResponseBody = {
    statusCode: err.statusCode,
    success: false,
    message: err.message,
    data: null,
    error: {
      code: err.errorCode,
      details: process.env.NODE_ENV === "development" ? err.details : undefined,
    },
  };

  return res.status(err.statusCode).json(body);
}
