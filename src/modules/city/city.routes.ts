import { Router } from "express";
import { cityController } from "./city.controller";

const router = Router();

router.get("/dashboard", (req, res) => cityController.getDashboard(req, res));
router.get("/filings/pending", (req, res) => cityController.listPendingFilings(req, res));
router.get("/filings/decisions", (req, res) => cityController.listDecisions(req, res));
router.patch("/filings/:filingId/approve", (req, res, next) => cityController.approveFiling(req, res, next));
router.patch("/filings/:filingId/reject", (req, res, next) => cityController.rejectFiling(req, res, next));

export const cityRoutes = router;
