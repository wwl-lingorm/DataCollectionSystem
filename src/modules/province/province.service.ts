import { enterpriseRepository } from "../enterprise/enterprise.repository";

export class ProvinceService {
  summary() {
    const filings = enterpriseRepository.listFilings();
    const reports = enterpriseRepository.listReports();

    const totalEmployed = reports.reduce((acc, row) => acc + row.employedCount, 0);
    const totalUnemployed = reports.reduce((acc, row) => acc + row.unemployedCount, 0);

    return {
      filingCount: filings.length,
      reportCount: reports.length,
      totalEmployed,
      totalUnemployed,
      generatedAt: new Date().toISOString()
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
