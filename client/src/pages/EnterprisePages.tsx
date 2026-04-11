import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlideDrawer } from "../components/SlideDrawer";
import {
  createFiling,
  createReport,
  fetchEnterpriseDashboard,
  fetchFilingDetail,
  fetchFilings,
  fetchReportDetail,
  fetchReports,
  type EnterpriseDashboard,
  type FilingDetail,
  type FilingRecord,
  type MonthlyReportRecord
} from "../lib/api";
import { roleMeta } from "../lib/workspace";

function StatCard({ title, value, caption }: { title: string; value: string; caption: string }) {
  return (
    <article className="stat-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </article>
  );
}

function getSection(pathname: string, expectedRoot: string) {
  const segments = pathname.split("/");
  if (segments[3] !== expectedRoot) {
    return "overview";
  }
  return segments[4] ?? "overview";
}

function SectionTabs({ items }: { items: Array<{ label: string; to: string }> }) {
  return (
    <div className="subnav">
      {items.map((item) => (
        <Link key={item.to} className="subnav-link" to={item.to}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function EnterpriseSummaryCards({ dashboard }: { dashboard: EnterpriseDashboard | null }) {
  return (
    <section className="stat-grid">
      <StatCard title="备案总数" value={String(dashboard?.filingCount ?? 0)} caption="企业备案总量" />
      <StatCard title="待审核" value={String(dashboard?.submittedCount ?? 0)} caption="正在流转到市级端" />
      <StatCard title="已通过" value={String(dashboard?.approvedCount ?? 0)} caption="市级审核通过" />
      <StatCard title="完成率" value={`${dashboard?.completionRate ?? 0}%`} caption="备案闭环进度" />
    </section>
  );
}

export function EnterpriseHomePage() {
  const [dashboard, setDashboard] = useState<EnterpriseDashboard | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setDashboard(await fetchEnterpriseDashboard());
      } catch {
        setDashboard(null);
      }
    })();
  }, []);

  return (
    <div className="page-stack">
      <div className="page-hero">
        <div>
          <div className="eyebrow">企业端</div>
          <h3>企业备案与月报入口</h3>
          <p>从这里进入备案填报、月度申报、通知回看和数据交换。</p>
        </div>
        <div className="hero-links">
          <Link to="/app/enterprise/filing/basic">去备案填报</Link>
          <Link to="/app/enterprise/reports/submit">去月报上报</Link>
          <Link to="/app/enterprise/notices">查看通知</Link>
        </div>
      </div>

      <EnterpriseSummaryCards dashboard={dashboard} />

      <section className="workflow-grid">
        <article className="workflow-card workflow-main">
          <div className="table-header">
            <h4>企业填报流程</h4>
            <span className="badge ghost">4 步闭环</span>
          </div>
          <div className="stepper">
            <div className="step active"><strong>01</strong><span>准备备案</span></div>
            <div className="step"><strong>02</strong><span>提交备案</span></div>
            <div className="step"><strong>03</strong><span>月报填报</span></div>
            <div className="step"><strong>04</strong><span>跟踪回执</span></div>
          </div>
          <div className="timeline-panel">
            <div className="timeline-item"><span>今日待办</span><strong>2 项</strong><p>补全企业信息并提交本月月报。</p></div>
            <div className="timeline-item"><span>最近状态</span><strong>{dashboard?.latestFiling?.status ?? "未提交"}</strong><p>备案通过后会进入市级审核。</p></div>
          </div>
        </article>

        <article className="workflow-card">
          <div className="table-header">
            <h4>快捷入口</h4>
          </div>
          <div className="shortcut-stack">
            <Link className="shortcut-card" to="/app/enterprise/filing/basic"><strong>备案填报</strong><span>建立企业基础档案</span></Link>
            <Link className="shortcut-card" to="/app/enterprise/reports/submit"><strong>月报上报</strong><span>补充就业失业数据</span></Link>
            <Link className="shortcut-card" to="/app/enterprise/notices"><strong>通知中心</strong><span>读取最新业务通知</span></Link>
            <Link className="shortcut-card" to="/app/enterprise/exchange"><strong>交换记录</strong><span>查看国家接口回执</span></Link>
          </div>
        </article>
      </section>
    </div>
  );
}

export function EnterpriseFilingPage() {
  const location = useLocation();
  const section = getSection(location.pathname, "filing");
  const [filings, setFilings] = useState<FilingRecord[]>([]);
  const [dashboard, setDashboard] = useState<EnterpriseDashboard | null>(null);
  const [detail, setDetail] = useState<FilingDetail | null>(null);
  const [selectedFilingId, setSelectedFilingId] = useState<string | null>(null);
  const [form, setForm] = useState({ enterpriseName: "", creditCode: "", cityCode: "" });

  async function load() {
    try {
      const [filingRows, enterpriseDashboard] = await Promise.all([fetchFilings(), fetchEnterpriseDashboard()]);
      setFilings(filingRows);
      setDashboard(enterpriseDashboard);
    } catch {
      setFilings([]);
      setDashboard(null);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await createFiling(form);
    setForm({ enterpriseName: "", creditCode: "", cityCode: "" });
    await load();
  }

  async function openDetail(filingId: string) {
    setSelectedFilingId(filingId);
    setDetail(null);
    try {
      setDetail(await fetchFilingDetail(filingId));
    } catch {
      setDetail(null);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-hero compact">
        <div>
          <div className="eyebrow">{roleMeta.enterprise.label}</div>
          <h3>备案填报</h3>
          <p>填写企业基础信息后，进入市级审核流转。</p>
        </div>
      </div>

      <SectionTabs
        items={[
          { label: "备案概览", to: "/app/enterprise/filing/overview" },
          { label: "基础填报", to: "/app/enterprise/filing/basic" },
          { label: "备案历史", to: "/app/enterprise/filing/history" }
        ]}
      />

      {section !== "history" ? <EnterpriseSummaryCards dashboard={dashboard} /> : null}

      {section === "overview" ? (
        <section className="workflow-grid">
          <article className="workflow-card workflow-main">
            <div className="table-header">
              <h4>备案流程概览</h4>
              <span className="badge ghost">当前状态：{dashboard?.latestFiling?.status ?? "无"}</span>
            </div>
            <div className="stepper compact">
              <div className="step active"><strong>01</strong><span>准备资料</span></div>
              <div className="step active"><strong>02</strong><span>提交备案</span></div>
              <div className="step"><strong>03</strong><span>市级审核</span></div>
              <div className="step"><strong>04</strong><span>结果回看</span></div>
            </div>
            <div className="timeline-panel">
              <div className="timeline-item"><span>最近备案</span><strong>{dashboard?.latestFiling?.enterpriseName ?? "暂无"}</strong><p>点击列表中的详情可查看完整备案信息和关联月报。</p></div>
              <div className="timeline-item"><span>关联月报</span><strong>{dashboard?.latestReport?.month ?? "暂无"}</strong><p>备案通过后即可继续月报填报。</p></div>
            </div>
          </article>
          <article className="workflow-card">
            <div className="table-header"><h4>操作建议</h4></div>
            <ul className="bullet-list">
              <li>先核对企业名称、信用代码、属地。</li>
              <li>备案提交后，市级端会接手审核。</li>
              <li>月报需和备案ID保持一致。</li>
            </ul>
          </article>
        </section>
      ) : null}

      {section !== "history" ? (
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            企业名称
            <input value={form.enterpriseName} onChange={(event) => setForm({ ...form, enterpriseName: event.target.value })} />
          </label>
          <label>
            统一信用代码
            <input value={form.creditCode} onChange={(event) => setForm({ ...form, creditCode: event.target.value })} />
          </label>
          <label>
            所在市代码
            <input value={form.cityCode} onChange={(event) => setForm({ ...form, cityCode: event.target.value })} />
          </label>
          <button className="primary-button" type="submit">提交备案</button>
        </form>
      ) : null}

      <section className="table-card">
        <div className="table-header">
          <h4>{section === "history" ? "备案历史" : "备案列表"}</h4>
          <button className="ghost-button" type="button" onClick={() => void load()}>刷新</button>
        </div>
        <div className="workflow-note">备案状态会先进入 submitted，再由市级端流转到 approved 或 rejected。</div>
        <div className="table-list">
          {filings.map((item) => (
            <article key={item.id} className="list-row">
              <div>
                <strong>{item.enterpriseName}</strong>
                <p>{item.creditCode} · {item.cityCode} · {item.createdAt}</p>
              </div>
              <div className="row-actions">
                <span className={`status ${item.status}`}>{item.status}</span>
                <button className="ghost-button small" type="button" onClick={() => void openDetail(item.id)}>
                  查看详情
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-grid">
        <article className="workflow-card">
          <div className="table-header">
            <h4>参考操作</h4>
          </div>
          <div className="shortcut-stack">
            <Link className="shortcut-card" to="/app/enterprise/filing/basic"><strong>先提交备案</strong><span>没有备案ID时先完成基础档案</span></Link>
            <Link className="shortcut-card" to="/app/enterprise/notices"><strong>查阅口径通知</strong><span>避免错报漏报</span></Link>
          </div>
        </article>

        <article className="workflow-card">
          <div className="table-header">
            <h4>示例历史</h4>
          </div>
          <div className="metric-list">
            <div><span>上月完成率</span><strong>{dashboard?.completionRate ?? 0}%</strong></div>
            <div><span>修正次数</span><strong>{dashboard?.rejectedCount ?? 0}</strong></div>
            <div><span>备案总量</span><strong>{dashboard?.filingCount ?? 0}</strong></div>
          </div>
        </article>
      </section>

      <SlideDrawer
        open={Boolean(selectedFilingId)}
        title="备案详情"
        subtitle={detail?.filing.enterpriseName ?? selectedFilingId ?? ""}
        onClose={() => {
          setSelectedFilingId(null);
          setDetail(null);
        }}
      >
        {detail ? (
          <div className="drawer-stack">
            <div className="drawer-block">
              <strong>备案信息</strong>
              <p>{detail.filing.creditCode}</p>
              <p>{detail.filing.cityCode}</p>
              <p>状态：{detail.filing.status}</p>
            </div>
            <div className="drawer-block">
              <strong>关联月报</strong>
              {detail.reports.length === 0 ? <p>暂无月报</p> : null}
              {detail.reports.map((report) => (
                <article key={report.id} className="drawer-record">
                  <span>{report.month}</span>
                  <p>就业 {report.employedCount} / 失业 {report.unemployedCount}</p>
                </article>
              ))}
            </div>
            <div className="drawer-actions">
              <Link className="primary-button" to="/app/enterprise/reports/submit">去填月报</Link>
            </div>
          </div>
        ) : (
          <p>正在加载详情...</p>
        )}
      </SlideDrawer>
    </div>
  );
}

export function EnterpriseReportPage() {
  const location = useLocation();
  const section = getSection(location.pathname, "reports");
  const [reports, setReports] = useState<MonthlyReportRecord[]>([]);
  const [dashboard, setDashboard] = useState<EnterpriseDashboard | null>(null);
  const [selectedReport, setSelectedReport] = useState<MonthlyReportRecord | null>(null);
  const [reportDrawerOpen, setReportDrawerOpen] = useState(false);
  const [form, setForm] = useState({ filingId: "", month: "2026-04", employedCount: 120, unemployedCount: 8 });

  async function load() {
    try {
      const [reportRows, enterpriseDashboard] = await Promise.all([fetchReports(), fetchEnterpriseDashboard()]);
      setReports(reportRows);
      setDashboard(enterpriseDashboard);
    } catch {
      setReports([]);
      setDashboard(null);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await createReport(form);
    await load();
  }

  async function openReport(reportId: string) {
    setReportDrawerOpen(true);
    setSelectedReport(null);
    try {
      setSelectedReport(await fetchReportDetail(reportId));
    } catch {
      setSelectedReport(null);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-hero compact">
        <div>
          <div className="eyebrow">{roleMeta.enterprise.label}</div>
          <h3>月报上报</h3>
          <p>企业月度就业与失业数据申报。</p>
        </div>
      </div>

      <SectionTabs
        items={[
          { label: "月报概览", to: "/app/enterprise/reports/overview" },
          { label: "月报提交", to: "/app/enterprise/reports/submit" },
          { label: "月报历史", to: "/app/enterprise/reports/history" }
        ]}
      />

      {section !== "history" ? <EnterpriseSummaryCards dashboard={dashboard} /> : null}

      {section === "overview" ? (
        <section className="workflow-grid">
          <article className="workflow-card workflow-main">
            <div className="table-header">
              <h4>本月申报指南</h4>
              <span className="badge ghost">月度闭环</span>
            </div>
            <div className="stepper compact">
              <div className="step active"><strong>01</strong><span>确认备案ID</span></div>
              <div className="step active"><strong>02</strong><span>录入就业人数</span></div>
              <div className="step"><strong>03</strong><span>核对失业人数</span></div>
              <div className="step"><strong>04</strong><span>提交月报</span></div>
            </div>
          </article>

          <article className="workflow-card">
            <div className="table-header">
              <h4>数据口径提示</h4>
            </div>
            <ul className="bullet-list">
              <li>就业人数按当月在岗人数填报。</li>
              <li>失业人数按登记在册数据填报。</li>
              <li>备案ID必须对应已提交备案记录。</li>
              <li>提交后可在历史记录中追踪版本。</li>
            </ul>
          </article>
        </section>
      ) : null}

      {section !== "history" ? (
        <form className="form-grid wide" onSubmit={handleSubmit}>
          <label>
            备案ID
            <input value={form.filingId} onChange={(event) => setForm({ ...form, filingId: event.target.value })} placeholder="先提交备案后复制ID" />
          </label>
          <label>
            月份
            <input value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })} placeholder="2026-04" />
          </label>
          <label>
            就业人数
            <input type="number" value={form.employedCount} onChange={(event) => setForm({ ...form, employedCount: Number(event.target.value) })} />
          </label>
          <label>
            失业人数
            <input type="number" value={form.unemployedCount} onChange={(event) => setForm({ ...form, unemployedCount: Number(event.target.value) })} />
          </label>
          <button className="primary-button" type="submit">提交月报</button>
        </form>
      ) : null}

      <section className="table-card">
        <div className="table-header">
          <h4>{section === "history" ? "月报历史" : "月报记录"}</h4>
          <button className="ghost-button" type="button" onClick={() => void load()}>刷新</button>
        </div>
        <div className="workflow-note">月报提交后，市级端会在审核区核对数据完整性，再进入省级汇总。</div>
        <div className="table-list">
          {reports.map((item) => (
            <article key={item.id} className="list-row two-line">
              <div>
                <strong>{item.month}</strong>
                <p>备案：{item.filingId}</p>
              </div>
              <div className="row-actions">
                <span>就业 {item.employedCount}</span>
                <span>失业 {item.unemployedCount}</span>
                <button className="ghost-button small" type="button" onClick={() => void openReport(item.id)}>
                  查看详情
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-grid">
        <article className="workflow-card">
          <div className="table-header">
            <h4>参考操作</h4>
          </div>
          <div className="shortcut-stack">
            <Link className="shortcut-card" to="/app/enterprise/filing/basic"><strong>先提交备案</strong><span>没有备案ID时先完成基础档案</span></Link>
            <Link className="shortcut-card" to="/app/enterprise/notices"><strong>查阅口径通知</strong><span>避免错报漏报</span></Link>
          </div>
        </article>

        <article className="workflow-card">
          <div className="table-header">
            <h4>示例历史</h4>
          </div>
          <div className="metric-list">
            <div><span>上月完成率</span><strong>{dashboard?.completionRate ?? 0}%</strong></div>
            <div><span>修正次数</span><strong>{dashboard?.rejectedCount ?? 0}</strong></div>
            <div><span>备案总量</span><strong>{dashboard?.filingCount ?? 0}</strong></div>
          </div>
        </article>
      </section>

      <SlideDrawer
        open={reportDrawerOpen}
        title="月报详情"
        subtitle={selectedReport?.month ?? ""}
        onClose={() => {
          setReportDrawerOpen(false);
          setSelectedReport(null);
        }}
      >
        {selectedReport ? (
          <div className="drawer-stack">
            <div className="drawer-block">
              <strong>申报记录</strong>
              <p>备案ID：{selectedReport.filingId}</p>
              <p>就业：{selectedReport.employedCount}</p>
              <p>失业：{selectedReport.unemployedCount}</p>
            </div>
            <div className="drawer-actions">
              <Link className="primary-button" to="/app/city/review/pending">去市级审核看板</Link>
            </div>
          </div>
        ) : (
          <p>正在加载详情...</p>
        )}
      </SlideDrawer>
    </div>
  );
}
