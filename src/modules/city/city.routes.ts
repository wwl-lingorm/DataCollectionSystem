import { Router } from "express";
import { cityController } from "./city.controller";

const router = Router();

router.get("/filings/pending", (req, res) => cityController.listPendingFilings(req, res));
router.patch("/filings/:filingId/approve", (req, res, next) => cityController.approveFiling(req, res, next));
router.patch("/filings/:filingId/reject", (req, res, next) => cityController.rejectFiling(req, res, next));

export const cityRoutes = router;
