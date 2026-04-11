import { randomUUID } from "crypto";
import { z } from "zod";
import { AppError } from "../../shared/errors/app-error";
import { enterpriseRepository } from "./enterprise.repository";

const filingSchema = z.object({
  enterpriseName: z.string().min(1),
  creditCode: z.string().min(6),
  cityCode: z.string().min(2)
});

const reportSchema = z.object({
  filingId: z.string().min(1),
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  employedCount: z.number().int().min(0),
  unemployedCount: z.number().int().min(0)
});

export class EnterpriseService {
  createFiling(payload: unknown) {
    const data = filingSchema.parse(payload);
    return enterpriseRepository.createFiling({
      id: randomUUID(),
      enterpriseName: data.enterpriseName,
      creditCode: data.creditCode,
      cityCode: data.cityCode,
      status: "submitted",
      createdAt: new Date().toISOString()
    });
  }

  listFilings() {
    return enterpriseRepository.listFilings();
  }

  getDashboard() {
    const filings = enterpriseRepository.listFilings();
    const reports = enterpriseRepository.listReports();
    const latestFiling = filings.length > 0 ? filings[filings.length - 1] : null;
    const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;

    const submittedCount = enterpriseRepository.listFilingsByStatus("submitted").length;
    const approvedCount = enterpriseRepository.listFilingsByStatus("approved").length;
    const rejectedCount = enterpriseRepository.listFilingsByStatus("rejected").length;

    return {
      filingCount: filings.length,
      submittedCount,
      approvedCount,
      rejectedCount,
      reportCount: reports.length,
      latestFiling,
      latestReport,
      completionRate: filings.length === 0 ? 0 : Math.round((approvedCount / filings.length) * 100),
      generatedAt: new Date().toISOString()
    };
  }

  getFilingDetail(filingId: string) {
    const filing = enterpriseRepository.findFilingById(filingId);

    if (!filing) {
      throw new AppError("Filing not found", 404);
    }

    return {
      filing,
      reports: enterpriseRepository.listReportsByFilingId(filingId)
    };
  }

  getReportDetail(reportId: string) {
    const report = enterpriseRepository.findReportById(reportId);

    if (!report) {
      throw new AppError("Report not found", 404);
    }

    return report;
  }

  submitMonthlyReport(payload: unknown) {
    const data = reportSchema.parse(payload);
    const filing = enterpriseRepository.findFilingById(data.filingId);

    if (!filing) {
      throw new AppError("Filing not found", 404);
    }

    return enterpriseRepository.createMonthlyReport({
      id: randomUUID(),
      filingId: data.filingId,
      month: data.month,
      employedCount: data.employedCount,
      unemployedCount: data.unemployedCount,
      createdAt: new Date().toISOString()
    });
  }

  listMonthlyReports() {
    return enterpriseRepository.listReports();
  }
}

export const enterpriseService = new EnterpriseService();
