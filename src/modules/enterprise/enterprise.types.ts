export interface EnterpriseFiling {
  id: string;
  enterpriseName: string;
  creditCode: string;
  cityCode: string;
  status: "submitted" | "approved" | "rejected";
  createdAt: string;
}

export interface MonthlyReport {
  id: string;
  filingId: string;
  month: string;
  employedCount: number;
  unemployedCount: number;
  createdAt: string;
}
