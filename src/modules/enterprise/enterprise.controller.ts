import { NextFunction, Request, Response } from "express";
import { enterpriseService } from "./enterprise.service";

export class EnterpriseController {
  private getStringParam(value: string | string[] | undefined) {
    if (Array.isArray(value)) {
      return value[0];
    }

    return value ?? "";
  }

  getDashboard(_req: Request, res: Response) {
    res.json({ success: true, data: enterpriseService.getDashboard() });
  }

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

  getFilingDetail(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: enterpriseService.getFilingDetail(this.getStringParam(req.params.filingId)) });
    } catch (error) {
      next(error);
    }
  }

  getReportDetail(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: enterpriseService.getReportDetail(this.getStringParam(req.params.reportId)) });
    } catch (error) {
      next(error);
    }
  }
}

export const enterpriseController = new EnterpriseController();
