import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { roleMeta, type UserRole } from "../lib/workspace";

const demoAccounts = [
  { username: "enterprise01", password: "123456", role: "enterprise" as const },
  { username: "city01", password: "123456", role: "city" as const },
  { username: "province01", password: "123456", role: "province" as const }
];

export function LoginPage() {
  const [username, setUsername] = useState("enterprise01");
  const [password, setPassword] = useState("123456");
  const [selectedRole, setSelectedRole] = useState<UserRole>("enterprise");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await auth.login(username, password);
      navigate(roleMeta[user.role].home, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(account: (typeof demoAccounts)[number]) {
    setUsername(account.username);
    setPassword(account.password);
    setSelectedRole(account.role);
  }

  return (
    <div className="login-page">
      <section className="hero-panel">
        <div className="hero-badge">云南省企业就业失业数据采集系统</div>
        <h1>让企业填报、市级审核、省级汇总在同一条导航链里流动。</h1>
        <p>
          这是一个按角色分层的前端工作台，支持企业端、市级端、省级端互相切换，展示备案、月报、审核、通知、交换、统计和系统管理页面。
        </p>

        <div className="demo-grid">
          {demoAccounts.map((account) => (
            <button key={account.role} className="demo-card" type="button" onClick={() => fillDemo(account)}>
              <span>{roleMeta[account.role].label}</span>
              <strong>{account.username}</strong>
              <small>密码：{account.password}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="login-panel">
        <h2>登录工作台</h2>
        <p>登录后会自动进入对应角色首页，顶部可继续切换其他端视图。</p>

        <form onSubmit={handleLogin} className="login-form">
          <label>
            账号
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="请输入账号" />
          </label>
          <label>
            密码
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入密码" />
          </label>
          <label>
            默认视图
            <select value={selectedRole} onChange={(event) => setSelectedRole(event.target.value as UserRole)}>
              <option value="enterprise">企业端</option>
              <option value="city">市级端</option>
              <option value="province">省级端</option>
            </select>
          </label>

          {error ? <div className="error-box">{error}</div> : null}

          <button className="primary-button full" type="submit" disabled={loading}>
            {loading ? "登录中..." : "进入系统"}
          </button>
        </form>

        <div className="hint-box">
          <strong>提示</strong>
          <p>如果后端未启动，前端仍会用内置演示账号完成登录和跳转。</p>
        </div>
      </section>
    </div>
  );
}
