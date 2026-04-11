import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlideDrawer } from "../components/SlideDrawer";
import { fetchProvinceDashboard, type ProvinceDashboard } from "../lib/api";

function getSection(pathname: string) {
  const segments = pathname.split("/");
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

function ProvinceSummaryCards({ dashboard }: { dashboard: ProvinceDashboard | null }) {
  return (
    <section className="stat-grid">
      <article className="stat-card"><span>全省备案</span><strong>{dashboard?.filingCount ?? 0}</strong><small>企业备案总量</small></article>
      <article className="stat-card"><span>月报数量</span><strong>{dashboard?.reportCount ?? 0}</strong><small>省级报表总量</small></article>
      <article className="stat-card"><span>就业总数</span><strong>{dashboard?.totalEmployed ?? 0}</strong><small>汇总统计值</small></article>
      <article className="stat-card"><span>失业总数</span><strong>{dashboard?.totalUnemployed ?? 0}</strong><small>汇总统计值</small></article>
    </section>
  );
}

export function ProvinceHomePage() {
  const [dashboard, setDashboard] = useState<ProvinceDashboard | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setDashboard(await fetchProvinceDashboard());
      } catch {
        setDashboard(null);
      }
    })();
  }, []);

  return (
    <div className="page-stack">
      <div className="page-hero">
        <div>
          <div className="eyebrow">省级端</div>
          <h3>省级监管与汇总中心</h3>
          <p>查看全省报表、导出数据、分析趋势，并统一管理系统配置。</p>
        </div>
        <div className="hero-links">
          <Link to="/app/province/summary/overview">去汇总报表</Link>
          <Link to="/app/province/analysis/trend">去图表分析</Link>
        </div>
      </div>

      <ProvinceSummaryCards dashboard={dashboard} />

      <section className="workflow-grid">
        <article className="workflow-card workflow-main">
          <div className="table-header">
            <h4>省级统计流</h4>
            <span className="badge ghost">统计 + 分析 + 导出</span>
          </div>
          <div className="stepper">
            <div className="step active"><strong>01</strong><span>汇聚备案</span></div>
            <div className="step active"><strong>02</strong><span>汇聚月报</span></div>
            <div className="step active"><strong>03</strong><span>图表分析</span></div>
            <div className="step"><strong>04</strong><span>形成报送</span></div>
          </div>
          <div className="timeline-panel">
            <div className="timeline-item"><span>本周重点</span><strong>异常数据修正</strong><p>对不一致的市级汇总进行复核后再导出。</p></div>
            <div className="timeline-item"><span>发布窗口</span><strong>月末 18:00</strong><p>建议在发布前完成统计和审签。</p></div>
          </div>
        </article>

        <article className="workflow-card">
          <div className="table-header"><h4>统计动作</h4></div>
          <div className="shortcut-stack">
            <Link className="shortcut-card" to="/app/province/summary/overview"><strong>汇总报表</strong><span>查看指标与导出入口</span></Link>
            <Link className="shortcut-card" to="/app/province/analysis/trend"><strong>图表分析</strong><span>查看趋势和占比</span></Link>
            <Link className="shortcut-card" to="/app/province/settings"><strong>系统管理</strong><span>配置口径与权限</span></Link>
          </div>
        </article>
      </section>
    </div>
  );
}

export function ProvinceSummaryPage() {
  const location = useLocation();
  const section = getSection(location.pathname);
  const [dashboard, setDashboard] = useState<ProvinceDashboard | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        setDashboard(await fetchProvinceDashboard());
      } catch {
        setDashboard(null);
      }
    })();
  }, []);

  const trendRows = Object.entries(dashboard?.monthlyTrend ?? {});
  const approvalRate = dashboard && dashboard.filingCount > 0 ? Math.round((dashboard.byStatus.approved / dashboard.filingCount) * 100) : 0;

  return (
    <div className="page-stack">
      <div className="page-hero compact">
        <div>
          <div className="eyebrow">省级端</div>
          <h3>汇总报表</h3>
          <p>聚合备案、月报和交换数据，支持导出。</p>
        </div>
      </div>

      <SectionTabs
        items={[
          { label: "汇总概览", to: "/app/province/summary/overview" },
          { label: "导出管理", to: "/app/province/summary/export" },
          { label: "地区对比", to: "/app/province/summary/comparison" }
        ]}
      />

      <ProvinceSummaryCards dashboard={dashboard} />

      {section === "overview" ? (
        <section className="workflow-grid">
          <article className="workflow-card workflow-main">
            <div className="table-header">
              <h4>省级汇总概览</h4>
              <span className="badge ghost">自动汇总</span>
            </div>
            <div className="stepper compact">
              <div className="step active"><strong>01</strong><span>汇总备案</span></div>
              <div className="step active"><strong>02</strong><span>汇总月报</span></div>
              <div className="step"><strong>03</strong><span>校验趋势</span></div>
              <div className="step"><strong>04</strong><span>形成报表</span></div>
            </div>
            <div className="timeline-panel">
              <div className="timeline-item"><span>最近备案</span><strong>{dashboard?.latestFiling?.enterpriseName ?? "暂无"}</strong><p>点击导出或趋势页继续查看。</p></div>
              <div className="timeline-item"><span>最近月报</span><strong>{dashboard?.latestReport?.month ?? "暂无"}</strong><p>可查看地区分布和行业结构。</p></div>
            </div>
          </article>
          <article className="workflow-card">
            <div className="table-header"><h4>状态分布</h4></div>
            <div className="metric-list">
              <div><span>提交中</span><strong>{dashboard?.byStatus.submitted ?? 0}</strong></div>
              <div><span>已通过</span><strong>{dashboard?.byStatus.approved ?? 0}</strong></div>
              <div><span>已驳回</span><strong>{dashboard?.byStatus.rejected ?? 0}</strong></div>
            </div>
          </article>
        </section>
      ) : null}

      {section === "export" ? (
        <section className="workflow-grid">
          <article className="workflow-card">
            <div className="table-header"><h4>导出管理</h4></div>
            <ul className="bullet-list">
              <li>导出前确认所有市级审核已完成。</li>
              <li>可下载 CSV，后续可扩展 XLSX。</li>
              <li>导出记录可接入审计日志。</li>
            </ul>
            <div className="hero-links">
              <a href="/api/v1/province/reports/export">下载报表</a>
              <button className="ghost-button" type="button" onClick={() => setDrawerOpen(true)}>查看最新数据</button>
            </div>
          </article>
          <article className="workflow-card">
            <div className="table-header"><h4>最近更新时间</h4></div>
            <div className="metric-list">
              <div><span>更新时间</span><strong>{dashboard?.generatedAt ?? "-"}</strong></div>
              <div><span>完成率</span><strong>{approvalRate}%</strong></div>
            </div>
          </article>
        </section>
      ) : null}

      {section === "comparison" ? (
        <section className="workflow-grid">
          <article className="workflow-card workflow-main">
            <div className="table-header"><h4>月度趋势</h4></div>
            <div className="table-list">
              {trendRows.map(([month, value]) => (
                <article key={month} className="list-row">
                  <div>
                    <strong>{month}</strong>
                    <p>就业 {value.employed} · 失业 {value.unemployed}</p>
                  </div>
                  <span className="status">趋势数据</span>
                </article>
              ))}
            </div>
          </article>
          <article className="workflow-card">
            <div className="table-header"><h4>对比说明</h4></div>
            <ul className="bullet-list">
              <li>通过趋势看就业恢复情况。</li>
              <li>结合失业人数变化识别风险区域。</li>
              <li>可按季度扩展为更细粒度对比。</li>
            </ul>
          </article>
        </section>
      ) : null}

      <SlideDrawer
        open={drawerOpen}
        title="省级最新数据"
        subtitle={dashboard?.latestReport?.month ?? ""}
        onClose={() => setDrawerOpen(false)}
      >
        {dashboard ? (
          <div className="drawer-stack">
            <div className="drawer-block">
              <strong>状态概览</strong>
              <p>提交中：{dashboard.byStatus.submitted}</p>
              <p>已通过：{dashboard.byStatus.approved}</p>
              <p>已驳回：{dashboard.byStatus.rejected}</p>
            </div>
            <div className="drawer-block">
              <strong>最新记录</strong>
              <p>备案：{dashboard.latestFiling?.enterpriseName ?? "暂无"}</p>
              <p>月报：{dashboard.latestReport?.month ?? "暂无"}</p>
            </div>
          </div>
        ) : (
          <p>正在加载详情...</p>
        )}
      </SlideDrawer>
    </div>
  );
}

export function ProvinceAnalysisPage() {
  const location = useLocation();
  const section = getSection(location.pathname);
  const [dashboard, setDashboard] = useState<ProvinceDashboard | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setDashboard(await fetchProvinceDashboard());
      } catch {
        setDashboard(null);
      }
    })();
  }, []);

  const bars = [
    { label: "企业备案", value: 78 },
    { label: "月报上报", value: 92 },
    { label: "市级审核", value: 84 },
    { label: "国家交换", value: 97 }
  ];

  return (
    <div className="page-stack">
      <div className="page-hero compact">
        <div>
          <div className="eyebrow">省级端</div>
          <h3>图表分析</h3>
          <p>用轻量前端条形图展示运行趋势，无需额外图表库也能清楚看板化。</p>
        </div>
      </div>

      <SectionTabs
        items={[
          { label: "趋势分析", to: "/app/province/analysis/trend" },
          { label: "异常预警", to: "/app/province/analysis/alerts" },
          { label: "地区分析", to: "/app/province/analysis/district" }
        ]}
      />

      {section === "trend" ? (
        <section className="chart-panel">
          {bars.map((bar) => (
            <div key={bar.label} className="chart-row">
              <div className="chart-head">
                <strong>{bar.label}</strong>
                <span>{bar.value}%</span>
              </div>
              <div className="chart-track">
                <div className="chart-fill" style={{ width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {section === "alerts" ? (
        <section className="workflow-grid">
          <article className="workflow-card workflow-main">
            <div className="table-header"><h4>异常预警</h4></div>
            <div className="metric-list">
              <div><span>低完成率地区</span><strong>2 个</strong></div>
              <div><span>重复备案</span><strong>1 条</strong></div>
              <div><span>交换失败</span><strong>0 条</strong></div>
            </div>
          </article>
          <article className="workflow-card">
            <div className="table-header"><h4>建议动作</h4></div>
            <ul className="bullet-list">
              <li>对低完成率地区发出督办提醒。</li>
              <li>对异常数据生成专项核查任务。</li>
              <li>对图表波动较大的行业做重点分析。</li>
            </ul>
          </article>
        </section>
      ) : null}

      {section === "district" ? (
        <section className="workflow-grid">
          <article className="workflow-card workflow-main">
            <div className="table-header"><h4>地区分析</h4></div>
            <div className="metric-list">
              <div><span>东部片区</span><strong>稳定</strong></div>
              <div><span>中部片区</span><strong>上升</strong></div>
              <div><span>西部片区</span><strong>波动</strong></div>
            </div>
          </article>
          <article className="workflow-card">
            <div className="table-header"><h4>解读说明</h4></div>
            <ul className="bullet-list">
              <li>结合地域差异制定专项策略。</li>
              <li>按月观察地区间恢复速度差异。</li>
              <li>可继续接入行业维度和企业规模维度。</li>
            </ul>
          </article>
        </section>
      ) : null}

      <section className="workflow-grid">
        <article className="workflow-card">
          <div className="table-header"><h4>结果解读</h4></div>
          <div className="metric-list">
            <div><span>备案趋势</span><strong>上升</strong></div>
            <div><span>审核效率</span><strong>稳定</strong></div>
            <div><span>交换质量</span><strong>良好</strong></div>
          </div>
        </article>
        <article className="workflow-card">
          <div className="table-header"><h4>最新统计值</h4></div>
          <div className="metric-list">
            <div><span>备案数量</span><strong>{dashboard?.filingCount ?? 0}</strong></div>
            <div><span>月报数量</span><strong>{dashboard?.reportCount ?? 0}</strong></div>
            <div><span>更新时间</span><strong>{dashboard?.generatedAt ?? "-"}</strong></div>
          </div>
        </article>
      </section>
    </div>
  );
}
