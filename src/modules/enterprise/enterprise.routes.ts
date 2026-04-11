import { Router } from "express";
import { enterpriseController } from "./enterprise.controller";

const router = Router();

router.get("/dashboard", (req, res) => enterpriseController.getDashboard(req, res));
router.post("/filings", (req, res, next) => enterpriseController.createFiling(req, res, next));
router.get("/filings", (req, res) => enterpriseController.listFilings(req, res));
router.get("/filings/:filingId", (req, res, next) => enterpriseController.getFilingDetail(req, res, next));
router.post("/reports", (req, res, next) => enterpriseController.submitMonthlyReport(req, res, next));
router.get("/reports", (req, res) => enterpriseController.listMonthlyReports(req, res));
router.get("/reports/:reportId", (req, res, next) => enterpriseController.getReportDetail(req, res, next));

export const enterpriseRoutes = router;
