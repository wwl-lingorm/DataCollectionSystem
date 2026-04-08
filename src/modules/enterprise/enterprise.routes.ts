import { Router } from "express";
import { enterpriseController } from "./enterprise.controller";

const router = Router();

router.post("/filings", (req, res, next) => enterpriseController.createFiling(req, res, next));
router.get("/filings", (req, res) => enterpriseController.listFilings(req, res));
router.post("/reports", (req, res, next) => enterpriseController.submitMonthlyReport(req, res, next));
router.get("/reports", (req, res) => enterpriseController.listMonthlyReports(req, res));

export const enterpriseRoutes = router;
