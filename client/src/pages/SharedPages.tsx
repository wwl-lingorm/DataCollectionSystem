import { useEffect, useState } from "react";
import { fetchExchangeHistory, fetchNotices, publishNotice, pushExchange, type ExchangeRecord, type NoticeRecord } from "../lib/api";

export function NoticeCenterPage() {
  const [notices, setNotices] = useState<NoticeRecord[]>([]);
  const [form, setForm] = useState({ title: "", content: "" });

  async function load() {
    setNotices(await fetchNotices());
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await publishNotice(form);
    setForm({ title: "", content: "" });
    await load();
  }

  return (
    <div className="page-stack">
      <div className="page-hero compact">
        <div>
          <div className="eyebrow">通知中心</div>
          <h3>公告与提醒</h3>
          <p>企业、市级、省级都可以在这里查看或发布通知。</p>
        </div>
      </div>

      <form className="form-grid wide" onSubmit={handleSubmit}>
        <label>
          标题
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </label>
        <label className="span-2">
          内容
          <textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} rows={4} />
        </label>
        <button className="primary-button" type="submit">发布通知</button>
      </form>

      <section className="table-card">
        <div className="table-header">
          <h4>通知列表</h4>
          <button className="ghost-button" type="button" onClick={() => void load()}>刷新</button>
        </div>
        <div className="workflow-note">通知支持三端共用，企业端用于查看，市级端用于下发，省级端用于统一口径。</div>
        <div className="table-list">
          {notices.map((item) => (
            <article key={item.id} className="notice-item">
              <strong>{item.title}</strong>
              <p>{item.content}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ExchangePage() {
  const [history, setHistory] = useState<ExchangeRecord[]>([]);
  const [payloadTag, setPayloadTag] = useState("province-monthly-batch");

  async function load() {
    setHistory(await fetchExchangeHistory());
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await pushExchange({ payloadTag });
    await load();
  }

  return (
    <div className="page-stack">
      <div className="page-hero compact">
        <div>
          <div className="eyebrow">数据交换</div>
          <h3>国家系统交换与回执</h3>
          <p>模拟推送国家系统数据包并查看历史回执。</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          数据包标记
          <input value={payloadTag} onChange={(event) => setPayloadTag(event.target.value)} />
        </label>
        <button className="primary-button" type="submit">推送数据包</button>
      </form>

      <section className="table-card">
        <div className="table-header">
          <h4>交换历史</h4>
          <button className="ghost-button" type="button" onClick={() => void load()}>刷新</button>
        </div>
        <div className="workflow-note">推送国家系统的数据包会先进入 queued，后续可扩展为 success / failed 回执流。</div>
        <div className="table-list">
          {history.map((item) => (
            <article key={item.id} className="list-row">
              <div>
                <strong>{item.payloadTag}</strong>
                <p>{item.pushedAt}</p>
              </div>
              <span className={`status ${item.status}`}>{item.status}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function SystemSettingsPage() {
  const items = [
    { title: "角色权限", content: "企业端只做填报，市级端负责审核，省级端负责汇总和分析。" },
    { title: "路由跳转", content: "顶部角色切换按钮可在不同端之间切换视图。" },
    { title: "接口策略", content: "前端优先调用后端 API，接口不可用时自动走演示模式。" }
  ];

  return (
    <div className="page-stack">
      <div className="page-hero compact">
        <div>
          <div className="eyebrow">系统管理</div>
          <h3>配置与权限说明</h3>
          <p>当前为前端逻辑阶段，保留未来接入账号、权限和字典配置的入口。</p>
        </div>
      </div>

      <section className="setting-grid">
        {items.map((item) => (
          <article key={item.title} className="setting-card">
            <h4>{item.title}</h4>
            <p>{item.content}</p>
          </article>
        ))}
      </section>

      <section className="workflow-grid">
        <article className="workflow-card">
          <div className="table-header"><h4>页面互跳逻辑</h4></div>
          <ul className="bullet-list">
            <li>登录后按角色进入对应工作台首页。</li>
            <li>侧边栏只显示当前视图下的功能入口。</li>
            <li>顶部按钮可在企业、市级、省级视图间切换。</li>
            <li>未登录访问业务页会被重定向回登录页。</li>
          </ul>
        </article>
        <article className="workflow-card">
          <div className="table-header"><h4>后续可扩展</h4></div>
          <div className="metric-list">
            <div><span>权限字典</span><strong>可接入</strong></div>
            <div><span>菜单配置</span><strong>可动态化</strong></div>
            <div><span>路由守卫</span><strong>可增强</strong></div>
          </div>
        </article>
      </section>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>页面不存在或路径未配置。</p>
      <a className="primary-button" href="/login">返回登录页</a>
    </div>
  );
}
