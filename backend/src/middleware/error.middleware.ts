import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../types/app-error.js";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ message: "Validation error", errors: err.issues });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
