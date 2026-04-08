export type UserRole = "enterprise" | "city" | "province";

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}
