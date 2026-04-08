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

  findFilingById(id: string) {
    return this.filings.find((f) => f.id === id);
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
}

export const enterpriseRepository = new EnterpriseRepository();
