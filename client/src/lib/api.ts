import type { AuthUser } from "../auth/AuthContext";
import type { UserRole } from "./workspace";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  const payload = (await response.json()) as ApiResponse<T> | { success: false; message?: string };

  if (!response.ok || !("success" in payload) || payload.success === false) {
    throw new Error((payload as { message?: string }).message ?? `Request failed: ${response.status}`);
  }

  return (payload as ApiResponse<T>).data;
}

export async function loginRequest(username: string, password: string): Promise<{ token: string; user: AuthUser }> {
  try {
    return await request<{ token: string; user: AuthUser }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  } catch {
    const demoUsers: Record<string, AuthUser & { password: string }> = {
      enterprise01: { id: "u1", username: "enterprise01", password: "123456", role: "enterprise" },
      city01: { id: "u2", username: "city01", password: "123456", role: "city" },
      province01: { id: "u3", username: "province01", password: "123456", role: "province" }
    };

    const user = demoUsers[username];
    if (!user || user.password !== password) {
      throw new Error("账号或密码错误");
    }

    return {
      token: `mock-token-${user.id}`,
      user: { id: user.id, username: user.username, role: user.role }
    };
  }
}

export type FilingRecord = {
  id: string;
  enterpriseName: string;
  creditCode: string;
  cityCode: string;
  status: string;
  createdAt: string;
};

export type FilingDetail = {
  filing: FilingRecord;
  reports: MonthlyReportRecord[];
};

export type MonthlyReportRecord = {
  id: string;
  filingId: string;
  month: string;
  employedCount: number;
  unemployedCount: number;
  createdAt: string;
};

export type EnterpriseDashboard = {
  filingCount: number;
  submittedCount: number;
  approvedCount: number;
  rejectedCount: number;
  reportCount: number;
  latestFiling: FilingRecord | null;
  latestReport: MonthlyReportRecord | null;
  completionRate: number;
  generatedAt: string;
};

export type CityDashboard = {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  latestPending: FilingRecord | null;
  latestDecision: FilingRecord | null;
  generatedAt: string;
};

export type ProvinceDashboard = {
  filingCount: number;
  reportCount: number;
  byStatus: {
    submitted: number;
    approved: number;
    rejected: number;
  };
  totalEmployed: number;
  totalUnemployed: number;
  monthlyTrend: Record<string, { employed: number; unemployed: number }>;
  latestFiling: FilingRecord | null;
  latestReport: MonthlyReportRecord | null;
  generatedAt: string;
};

export type NoticeRecord = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type ExchangeRecord = {
  id: string;
  payloadTag: string;
  status: string;
  pushedAt: string;
};

export async function fetchFilings() {
  return request<FilingRecord[]>("/api/v1/enterprise/filings");
}

export async function fetchEnterpriseDashboard() {
  return request<EnterpriseDashboard>("/api/v1/enterprise/dashboard");
}

export async function fetchFilingDetail(filingId: string) {
  return request<FilingDetail>(`/api/v1/enterprise/filings/${filingId}`);
}

export async function createFiling(payload: { enterpriseName: string; creditCode: string; cityCode: string }) {
  return request<FilingRecord>("/api/v1/enterprise/filings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchReports() {
  return request<MonthlyReportRecord[]>("/api/v1/enterprise/reports");
}

export async function fetchReportDetail(reportId: string) {
  return request<MonthlyReportRecord>(`/api/v1/enterprise/reports/${reportId}`);
}

export async function createReport(payload: { filingId: string; month: string; employedCount: number; unemployedCount: number }) {
  return request<MonthlyReportRecord>("/api/v1/enterprise/reports", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchPendingFilings() {
  return request<FilingRecord[]>("/api/v1/city/filings/pending");
}

export async function fetchCityDashboard() {
  return request<CityDashboard>("/api/v1/city/dashboard");
}

export async function fetchDecisionHistory() {
  return request<FilingRecord[]>("/api/v1/city/filings/decisions");
}

export async function approveFiling(filingId: string) {
  return request<FilingRecord>(`/api/v1/city/filings/${filingId}/approve`, { method: "PATCH" });
}

export async function rejectFiling(filingId: string) {
  return request<FilingRecord>(`/api/v1/city/filings/${filingId}/reject`, { method: "PATCH" });
}

export async function fetchProvinceSummary() {
  return request<Record<string, unknown>>("/api/v1/province/reports/summary");
}

export async function fetchProvinceDashboard() {
  return request<ProvinceDashboard>("/api/v1/province/dashboard");
}

export async function fetchNotices() {
  return request<NoticeRecord[]>("/api/v1/notice/list");
}

export async function publishNotice(payload: { title: string; content: string }) {
  return request<NoticeRecord>("/api/v1/notice/publish", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchExchangeHistory() {
  return request<ExchangeRecord[]>("/api/v1/exchange/history");
}

export async function pushExchange(payload: { payloadTag: string }) {
  return request<ExchangeRecord>("/api/v1/exchange/push-national", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
