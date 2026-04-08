import { User } from "./auth.types";

export class AuthRepository {
  private readonly users: User[] = [
    { id: "u1", username: "enterprise01", password: "123456", role: "enterprise" },
    { id: "u2", username: "city01", password: "123456", role: "city" },
    { id: "u3", username: "province01", password: "123456", role: "province" }
  ];

  findByUsername(username: string) {
    return this.users.find((u) => u.username === username);
  }
}

export const authRepository = new AuthRepository();
