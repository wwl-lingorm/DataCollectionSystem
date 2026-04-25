import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app";
import { enterpriseRepository } from "../../src/modules/enterprise/enterprise.repository";

describe("Backend API integration", () => {
  const app = createApp();

  beforeEach(() => {
    enterpriseRepository.reset();
  });

  it("returns health status", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("ok");
  });

  it("supports enterprise -> city -> province flow", async () => {
    const loginRes = await request(app).post("/api/v1/auth/login").send({
      username: "enterprise01",
      password: "123456"
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.user.role).toBe("enterprise");

    const filingRes = await request(app).post("/api/v1/enterprise/filings").send({
      enterpriseName: "昆明测试企业",
      creditCode: "91530000123456789A",
      cityCode: "5301"
    });

    expect(filingRes.status).toBe(201);
    const filingId = filingRes.body.data.id as string;

    const pendingRes = await request(app).get("/api/v1/city/filings/pending");
    expect(pendingRes.status).toBe(200);
    expect(pendingRes.body.data.length).toBe(1);

    const approveRes = await request(app).patch(`/api/v1/city/filings/${filingId}/approve`);
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.status).toBe("approved");

    const reportRes = await request(app).post("/api/v1/enterprise/reports").send({
      filingId,
      month: "2026-04",
      employedCount: 128,
      unemployedCount: 6
    });

    expect(reportRes.status).toBe(201);

    const provinceDashboardRes = await request(app).get("/api/v1/province/dashboard");
    expect(provinceDashboardRes.status).toBe(200);
    expect(provinceDashboardRes.body.data.filingCount).toBe(1);
    expect(provinceDashboardRes.body.data.reportCount).toBe(1);
    expect(provinceDashboardRes.body.data.byStatus.approved).toBe(1);

    const enterpriseDashboardRes = await request(app).get("/api/v1/enterprise/dashboard");
    expect(enterpriseDashboardRes.status).toBe(200);
    expect(enterpriseDashboardRes.body.data.reportCount).toBe(1);
  });
});
