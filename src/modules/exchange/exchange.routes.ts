import { Router } from "express";
import { exchangeController } from "./exchange.controller";

const router = Router();

router.post("/push-national", (req, res, next) => exchangeController.pushNational(req, res, next));
router.get("/history", (req, res) => exchangeController.listHistory(req, res));

export const exchangeRoutes = router;
