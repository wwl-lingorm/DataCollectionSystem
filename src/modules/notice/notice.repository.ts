import { Notice } from "./notice.types";

export class NoticeRepository {
  private notices: Notice[] = [];

  create(notice: Notice) {
    this.notices.push(notice);
    return notice;
  }

  list() {
    return this.notices;
  }
}

export const noticeRepository = new NoticeRepository();
