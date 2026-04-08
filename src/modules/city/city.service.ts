import { AppError } from "../../shared/errors/app-error";
import { enterpriseRepository } from "../enterprise/enterprise.repository";

export class CityService {
  listPendingFilings() {
    return enterpriseRepository.listFilings().filter((item) => item.status === "submitted");
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
