import { Router } from "express";
import { noticeController } from "./notice.controller";

const router = Router();

router.post("/publish", (req, res, next) => noticeController.publish(req, res, next));
router.get("/list", (req, res) => noticeController.list(req, res));

export const noticeRoutes = router;
