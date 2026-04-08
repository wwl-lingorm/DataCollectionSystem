import { ExchangeRecord } from "./exchange.types";

export class ExchangeRepository {
  private records: ExchangeRecord[] = [];

  create(row: ExchangeRecord) {
    this.records.push(row);
    return row;
  }

  list() {
    return this.records;
  }
}

export const exchangeRepository = new ExchangeRepository();
