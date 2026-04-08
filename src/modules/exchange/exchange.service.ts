import { randomUUID } from "crypto";
import { z } from "zod";
import { exchangeRepository } from "./exchange.repository";

const exchangeSchema = z.object({
  payloadTag: z.string().min(1)
});

export class ExchangeService {
  pushNational(payload: unknown) {
    const data = exchangeSchema.parse(payload);
    return exchangeRepository.create({
      id: randomUUID(),
      payloadTag: data.payloadTag,
      status: "queued",
      pushedAt: new Date().toISOString()
    });
  }

  listHistory() {
    return exchangeRepository.list();
  }
}

export const exchangeService = new ExchangeService();
