import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authRoutes } from "./modules/auth/auth.routes";
import { cityRoutes } from "./modules/city/city.routes";
import { enterpriseRoutes } from "./modules/enterprise/enterprise.routes";
import { exchangeRoutes } from "./modules/exchange/exchange.routes";
import { noticeRoutes } from "./modules/notice/notice.routes";
import { provinceRoutes } from "./modules/province/province.routes";
import { notFoundHandler } from "./shared/middlewares/not-found";
import { errorHandler } from "./shared/middlewares/error-handler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/api/v1/health", (_req, res) => {
    res.json({ success: true, message: "ok" });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/enterprise", enterpriseRoutes);
  app.use("/api/v1/city", cityRoutes);
  app.use("/api/v1/province", provinceRoutes);
  app.use("/api/v1/notice", noticeRoutes);
  app.use("/api/v1/exchange", exchangeRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
