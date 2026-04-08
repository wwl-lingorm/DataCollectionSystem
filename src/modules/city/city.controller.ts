import { NextFunction, Request, Response } from "express";
import { cityService } from "./city.service";

export class CityController {
  private getFilingId(req: Request) {
    const value = req.params.filingId;
    return Array.isArray(value) ? value[0] : value;
  }

  listPendingFilings(_req: Request, res: Response) {
    const rows = cityService.listPendingFilings();
    res.json({ success: true, data: rows });
  }

  approveFiling(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = cityService.approveFiling(this.getFilingId(req));
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  rejectFiling(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = cityService.rejectFiling(this.getFilingId(req));
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}

export const cityController = new CityController();
