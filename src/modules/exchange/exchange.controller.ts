import { NextFunction, Request, Response } from "express";
import { exchangeService } from "./exchange.service";

export class ExchangeController {
  pushNational(req: Request, res: Response, next: NextFunction) {
    try {
      const row = exchangeService.pushNational(req.body);
      res.status(201).json({ success: true, data: row });
    } catch (error) {
      next(error);
    }
  }

  listHistory(_req: Request, res: Response) {
    res.json({ success: true, data: exchangeService.listHistory() });
  }
}

export const exchangeController = new ExchangeController();
