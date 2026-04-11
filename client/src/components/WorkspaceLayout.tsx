import { useEffect } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { roleMeta, type UserRole } from "../lib/workspace";

function isUserRole(value: string | undefined): value is UserRole {
  return value === "enterprise" || value === "city" || value === "province";
}

export function WorkspaceLayout() {
  const params = useParams();
  const navigate = useNavigate();
  const { user, viewRole, switchViewRole, logout } = useAuth();

  const routeRole = isUserRole(params.role) ? params.role : user?.role ?? "enterprise";

  useEffect(() => {
    if (!isUserRole(params.role)) {
      navigate(roleMeta[user?.role ?? "enterprise"].home, { replace: true });
      return;
    }

    switchViewRole(routeRole);
  }, [navigate, params.role, routeRole, switchViewRole, user?.role]);

  const menu = roleMeta[viewRole].menus;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">云</div>
          <div>
            <h1>数据采集系统</h1>
            <p>分层模块化前端</p>
          </div>
        </div>

        <nav className="menu">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
            >
              <span>{item.label}</span>
              <small>{item.description}</small>
            </NavLink>
          ))}
        </nav>

        <div className="role-switcher">
          <p>切换视图</p>
          <div className="role-switch-grid">
            {(Object.keys(roleMeta) as UserRole[]).map((role) => (
              <button
                key={role}
                className={role === viewRole ? "role-chip active" : "role-chip"}
                onClick={() => navigate(roleMeta[role].home)}
                type="button"
              >
                {roleMeta[role].label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <div className="eyebrow">当前登录：{user?.username}</div>
            <h2>{roleMeta[viewRole].label}</h2>
          </div>

          <div className="topbar-actions">
            {viewRole !== user?.role ? <span className="badge ghost">演示视图</span> : <span className="badge">身份视图</span>}
            <button className="ghost-button" type="button" onClick={() => navigate(roleMeta[user?.role ?? "enterprise"].home)}>
              回到我的端
            </button>
            <button className="primary-button" type="button" onClick={logout}>
              退出登录
            </button>
          </div>
        </header>

        <section className="content-card">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
