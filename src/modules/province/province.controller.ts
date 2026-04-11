import { Request, Response } from "express";
import { provinceService } from "./province.service";

export class ProvinceController {
  dashboard(_req: Request, res: Response) {
    res.json({ success: true, data: provinceService.dashboard() });
  }

  summary(_req: Request, res: Response) {
    res.json({ success: true, data: provinceService.summary() });
  }

  exportCsv(_req: Request, res: Response) {
    res.json({ success: true, data: provinceService.exportCsv() });
  }
}

export const provinceController = new ProvinceController();
