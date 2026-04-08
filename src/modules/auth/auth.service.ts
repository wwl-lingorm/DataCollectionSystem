import { z } from "zod";
import { AppError } from "../../shared/errors/app-error";
import { authRepository } from "./auth.repository";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export class AuthService {
  login(payload: unknown) {
    const data = loginSchema.parse(payload);
    const user = authRepository.findByUsername(data.username);

    if (!user || user.password !== data.password) {
      throw new AppError("Invalid username or password", 401);
    }

    return {
      token: `mock-token-${user.id}`,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  }
}

export const authService = new AuthService();
