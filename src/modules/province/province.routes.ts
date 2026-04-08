import { Router } from "express";
import { provinceController } from "./province.controller";

const router = Router();

router.get("/reports/summary", (req, res) => provinceController.summary(req, res));
router.get("/reports/export", (req, res) => provinceController.exportCsv(req, res));

export const provinceRoutes = router;
