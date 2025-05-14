import type { Response } from "express";
export class ApiResponse<T = any> {
  constructor(
    public statusCode: number,
    public data: T | null = null,
    public message: string = "🎉 Operation completed successfully!",
    public success: boolean = true
  ) {}

  send(res: Response) {
    return res.status(this.statusCode).json({
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
    });
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
