import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";

export class AuthController {
  login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = authService.login(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
