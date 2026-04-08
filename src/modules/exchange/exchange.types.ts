export interface ExchangeRecord {
  id: string;
  payloadTag: string;
  status: "queued" | "success" | "failed";
  pushedAt: string;
}
