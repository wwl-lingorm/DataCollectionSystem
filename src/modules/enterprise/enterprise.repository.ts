import { EnterpriseFiling, MonthlyReport } from "./enterprise.types";

export class EnterpriseRepository {
  private filings: EnterpriseFiling[] = [];
  private reports: MonthlyReport[] = [];

  createFiling(filing: EnterpriseFiling) {
    this.filings.push(filing);
    return filing;
  }

  listFilings() {
    return this.filings;
  }

  listFilingsByStatus(status: EnterpriseFiling["status"]) {
    return this.filings.filter((item) => item.status === status);
  }

  findFilingById(id: string) {
    return this.filings.find((f) => f.id === id);
  }

  findReportById(id: string) {
    return this.reports.find((report) => report.id === id);
  }

  updateFilingStatus(id: string, status: EnterpriseFiling["status"]) {
    const target = this.findFilingById(id);
    if (!target) {
      return null;
    }
    target.status = status;
    return target;
  }

  createMonthlyReport(report: MonthlyReport) {
    this.reports.push(report);
    return report;
  }

  listReports() {
    return this.reports;
  }

  listReportsByFilingId(filingId: string) {
    return this.reports.filter((item) => item.filingId === filingId);
  }

  reset() {
    this.filings = [];
    this.reports = [];
  }
}

export const enterpriseRepository = new EnterpriseRepository();
