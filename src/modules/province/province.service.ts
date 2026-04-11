import { enterpriseRepository } from "../enterprise/enterprise.repository";

export class ProvinceService {
  dashboard() {
    const filings = enterpriseRepository.listFilings();
    const reports = enterpriseRepository.listReports();
    const latestFiling = filings.length > 0 ? filings[filings.length - 1] : null;
    const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;

    const monthlyTrend = reports.reduce<Record<string, { employed: number; unemployed: number }>>((acc, report) => {
      if (!acc[report.month]) {
        acc[report.month] = { employed: 0, unemployed: 0 };
      }

      acc[report.month].employed += report.employedCount;
      acc[report.month].unemployed += report.unemployedCount;
      return acc;
    }, {});

    return {
      filingCount: filings.length,
      reportCount: reports.length,
      byStatus: {
        submitted: filings.filter((item) => item.status === "submitted").length,
        approved: filings.filter((item) => item.status === "approved").length,
        rejected: filings.filter((item) => item.status === "rejected").length
      },
      totalEmployed: reports.reduce((acc, row) => acc + row.employedCount, 0),
      totalUnemployed: reports.reduce((acc, row) => acc + row.unemployedCount, 0),
      monthlyTrend,
      latestFiling,
      latestReport,
      generatedAt: new Date().toISOString()
    };
  }

  summary() {
    const dashboard = this.dashboard();

    return {
      filingCount: dashboard.filingCount,
      reportCount: dashboard.reportCount,
      totalEmployed: dashboard.totalEmployed,
      totalUnemployed: dashboard.totalUnemployed,
      byStatus: dashboard.byStatus,
      generatedAt: dashboard.generatedAt
    };
  }

  exportCsv() {
    return {
      fileName: `province-summary-${Date.now()}.csv`,
      downloadUrl: "/downloads/mock-province-summary.csv"
    };
  }
}

export const provinceService = new ProvinceService();
