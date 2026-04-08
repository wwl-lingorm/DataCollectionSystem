import { NextFunction, Request, Response } from "express";
import { noticeService } from "./notice.service";

export class NoticeController {
  publish(req: Request, res: Response, next: NextFunction) {
    try {
      const row = noticeService.publish(req.body);
      res.status(201).json({ success: true, data: row });
    } catch (error) {
      next(error);
    }
  }

  list(_req: Request, res: Response) {
    res.json({ success: true, data: noticeService.list() });
  }
}

export const noticeController = new NoticeController();
