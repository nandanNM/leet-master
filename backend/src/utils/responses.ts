import type { Response } from "express";

export class ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export function errorResponse(
  res: Response,
  status: number,
  error: string,
  message: string = "An unexpected error occurred. We're working on it — please try again shortly."
) {
  return res
    .status(status)
    .json({ statusCode: status, success: false, message, error });
}
