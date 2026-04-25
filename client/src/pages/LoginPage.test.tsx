import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../auth/AuthContext";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));
  });

  it("renders login workspace title", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "登录工作台" })).toBeInTheDocument();
    expect(screen.getByText("云南省企业就业失业数据采集系统")).toBeInTheDocument();
  });

  it("fills account from city demo card and can login", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /city01/i }));
    const accountInput = screen.getByPlaceholderText("请输入账号") as HTMLInputElement;

    expect(accountInput.value).toBe("city01");

    await user.click(screen.getByRole("button", { name: "进入系统" }));

    const authState = localStorage.getItem("dcs-auth-state");
    expect(authState).toContain("city01");
  });
});
