import { NextFunction, Request, Response } from "express";
import { enterpriseService } from "./enterprise.service";

export class EnterpriseController {
  createFiling(req: Request, res: Response, next: NextFunction) {
    try {
      const filing = enterpriseService.createFiling(req.body);
      res.status(201).json({ success: true, data: filing });
    } catch (error) {
      next(error);
    }
  }

  listFilings(_req: Request, res: Response) {
    const filings = enterpriseService.listFilings();
    res.json({ success: true, data: filings });
  }

  submitMonthlyReport(req: Request, res: Response, next: NextFunction) {
    try {
      const report = enterpriseService.submitMonthlyReport(req.body);
      res.status(201).json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  listMonthlyReports(_req: Request, res: Response) {
    const reports = enterpriseService.listMonthlyReports();
    res.json({ success: true, data: reports });
  }
}

export const enterpriseController = new EnterpriseController();
