import { randomUUID } from "crypto";
import { z } from "zod";
import { noticeRepository } from "./notice.repository";

const noticeSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1)
});

export class NoticeService {
  publish(payload: unknown) {
    const data = noticeSchema.parse(payload);
    return noticeRepository.create({
      id: randomUUID(),
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString()
    });
  }

  list() {
    return noticeRepository.list();
  }
}

export const noticeService = new NoticeService();
