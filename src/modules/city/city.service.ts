import { AppError } from "../../shared/errors/app-error";
import { enterpriseRepository } from "../enterprise/enterprise.repository";

export class CityService {
  getDashboard() {
    const pending = enterpriseRepository.listFilings().filter((item) => item.status === "submitted");
    const approved = enterpriseRepository.listFilings().filter((item) => item.status === "approved");
    const rejected = enterpriseRepository.listFilings().filter((item) => item.status === "rejected");
    const latestPending = pending.length > 0 ? pending[pending.length - 1] : null;
    const decisions = [...approved, ...rejected];
    const latestDecision = decisions.length > 0 ? decisions[decisions.length - 1] : null;

    return {
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      latestPending,
      latestDecision,
      generatedAt: new Date().toISOString()
    };
  }

  listPendingFilings() {
    return enterpriseRepository.listFilings().filter((item) => item.status === "submitted");
  }

  listDecisions() {
    return enterpriseRepository
      .listFilings()
      .filter((item) => item.status === "approved" || item.status === "rejected")
      .reverse();
  }

  approveFiling(filingId: string) {
    const updated = enterpriseRepository.updateFilingStatus(filingId, "approved");
    if (!updated) {
      throw new AppError("Filing not found", 404);
    }
    return updated;
  }

  rejectFiling(filingId: string) {
    const updated = enterpriseRepository.updateFilingStatus(filingId, "rejected");
    if (!updated) {
      throw new AppError("Filing not found", 404);
    }
    return updated;
  }
}

export const cityService = new CityService();
