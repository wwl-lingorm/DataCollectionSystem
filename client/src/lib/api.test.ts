import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEnterpriseDashboard, loginRequest } from "./api";

describe("frontend api layer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to local demo login when backend is unavailable", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    const result = await loginRequest("enterprise01", "123456");

    expect(result.user.username).toBe("enterprise01");
    expect(result.user.role).toBe("enterprise");
    expect(result.token).toContain("mock-token");
  });

  it("calls enterprise dashboard endpoint", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          filingCount: 1,
          submittedCount: 1,
          approvedCount: 0,
          rejectedCount: 0,
          reportCount: 0,
          latestFiling: null,
          latestReport: null,
          completionRate: 0,
          generatedAt: "2026-04-24T00:00:00.000Z"
        }
      })
    } as Response);

    const result = await fetchEnterpriseDashboard();

    expect(result.filingCount).toBe(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/v1/enterprise/dashboard",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json"
        })
      })
    );
  });
});
