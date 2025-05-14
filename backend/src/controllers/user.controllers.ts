import { Request, Response } from "express";
export async function register(req: Request, res: Response): Promise<void> {
  console.log(req);
}
