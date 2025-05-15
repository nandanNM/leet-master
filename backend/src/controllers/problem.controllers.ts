import { NextFunction, Request, Response } from "express";

export async function createProblem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
export async function getAllProblems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
export async function getProblemById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
export async function updateProblem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
export async function deleteProblem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}

export async function getAllProblemsSolvedByUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {}
