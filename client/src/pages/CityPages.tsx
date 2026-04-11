import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlideDrawer } from "../components/SlideDrawer";
import {
  approveFiling,
  fetchCityDashboard,
  fetchDecisionHistory,
  fetchFilingDetail,
  fetchPendingFilings,
  rejectFiling,
  type CityDashboard,
  type FilingDetail,
  type FilingRecord
} from "../lib/api";

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

function CitySummaryCards({ dashboard }: { dashboard: CityDashboard | null }) {
  return (
    <section className="stat-grid">
      <article className="stat-card"><span>待审核</span><strong>{dashboard?.pendingCount ?? 0}</strong><small>企业备案申请</small></article>
      <article className="stat-card"><span>已通过</span><strong>{dashboard?.approvedCount ?? 0}</strong><small>市级审核通过</small></article>
      <article className="stat-card"><span>已驳回</span><strong>{dashboard?.rejectedCount ?? 0}</strong><small>需要企业修正</small></article>
      <article className="stat-card"><span>最新决定</span><strong>{dashboard?.latestDecision?.status ?? "-"}</strong><small>最新流转状态</small></article>
    </section>
  );
}

export function CityHomePage() {
  const [dashboard, setDashboard] = useState<CityDashboard | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setDashboard(await fetchCityDashboard());
      } catch {
        setDashboard(null);
      }
    })();
  }, []);

  return (
    <div className="page-stack">
      <div className="page-hero">
        <div>
          <div className="eyebrow">市级端</div>
          <h3>备案审核工作台</h3>
          <p>处理企业提交的备案申请，并向省级汇总审核结果。</p>
        </div>
        <div className="hero-links">
          <Link to="/app/city/review/queue">去审核队列</Link>
          <Link to="/app/city/review/decisions">审核历史</Link>
          <Link to="/app/city/notices">去通知中心</Link>
        </div>
      </div>

      <CitySummaryCards dashboard={dashboard} />

      <section className="workflow-grid">
        <article className="workflow-card workflow-main">
          <div className="table-header">
            <h4>审核流转</h4>
            <span className="badge ghost">市级责任</span>
          </div>
          <div className="stepper">
            <div className="step active"><strong>01</strong><span>接收备案</span></div>
            <div className="step active"><strong>02</strong><span>核验材料</span></div>
            <div className="step"><strong>03</strong><span>审核结果</span></div>
            <div className="step"><strong>04</strong><span>反馈企业</span></div>
          </div>
          <div className="timeline-panel">
            <div className="timeline-item"><span>本日审核重点</span><strong>企业完整性</strong><p>核对企业名称、代码、属地和联系方式。</p></div>
            <div className="timeline-item"><span>风险提醒</span><strong>3 条异常</strong><p>重复备案、代码缺失、属地不一致。</p></div>
          </div>
        </article>

        <article className="workflow-card">
          <div className="table-header"><h4>审核操作说明</h4></div>
          <ul className="bullet-list">
            <li>通过后备案状态变为 approved。</li>
            <li>驳回后企业需修正并重新提交。</li>
            <li>审核结果会同步到省级汇总。</li>
            <li>交换回执异常需单独处理。</li>
          </ul>
        </article>
      </section>
    </div>
  );
}

export function CityReviewPage() {
  const location = useLocation();
  const section = getSection(location.pathname);
  const [dashboard, setDashboard] = useState<CityDashboard | null>(null);
  const [pendingRows, setPendingRows] = useState<FilingRecord[]>([]);
  const [decisionRows, setDecisionRows] = useState<FilingRecord[]>([]);
  const [detail, setDetail] = useState<FilingDetail | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function load() {
    try {
      const [cityDashboard, pending, decisions] = await Promise.all([
        fetchCityDashboard(),
        fetchPendingFilings(),
        fetchDecisionHistory()
      ]);
      setDashboard(cityDashboard);
      setPendingRows(pending);
      setDecisionRows(decisions);
    } catch {
      setDashboard(null);
      setPendingRows([]);
      setDecisionRows([]);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleApprove(id: string) {
    await approveFiling(id);
    await load();
  }

  async function handleReject(id: string) {
    await rejectFiling(id);
    await load();
  }

  async function openDetail(filingId: string) {
    setDrawerOpen(true);
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
          <div className="eyebrow">市级端</div>
          <h3>备案审核</h3>
          <p>对企业备案进行通过或驳回操作。</p>
        </div>
      </div>

      <SectionTabs
        items={[
          { label: "待审队列", to: "/app/city/review/queue" },
          { label: "审核历史", to: "/app/city/review/decisions" },
          { label: "审核流程", to: "/app/city/review/flow" }
        ]}
      />

      {section !== "decisions" ? <CitySummaryCards dashboard={dashboard} /> : null}

      {section === "flow" ? (
        <section className="workflow-grid">
          <article className="workflow-card workflow-main">
            <div className="table-header">
              <h4>审核流转说明</h4>
              <span className="badge ghost">人工审核 + 结果回传</span>
            </div>
            <div className="stepper compact">
              <div className="step active"><strong>01</strong><span>接收备案</span></div>
              <div className="step active"><strong>02</strong><span>识别异常</span></div>
              <div className="step"><strong>03</strong><span>录入意见</span></div>
              <div className="step"><strong>04</strong><span>回传企业</span></div>
            </div>
            <div className="timeline-panel">
              <div className="timeline-item"><span>审核优先级</span><strong>高</strong><p>优先处理申报不完整和属地冲突记录。</p></div>
              <div className="timeline-item"><span>输出结果</span><strong>通过 / 驳回</strong><p>审核结果同步省级汇总和企业端消息。</p></div>
            </div>
          </article>
          <article className="workflow-card">
            <div className="table-header"><h4>审核规则</h4></div>
            <ul className="bullet-list">
              <li>企业名称与统一信用代码必须匹配。</li>
              <li>属地代码与市级归属必须一致。</li>
              <li>异常记录需先做退回说明。</li>
            </ul>
          </article>
        </section>
      ) : null}

      {section === "decisions" ? (
        <section className="table-card">
          <div className="table-header">
            <h4>审核历史</h4>
            <button className="ghost-button" type="button" onClick={() => void load()}>刷新</button>
          </div>
          <div className="workflow-note">这里记录已通过和已驳回的备案，便于后续追溯和统计。</div>
          <div className="table-list">
            {decisionRows.map((item) => (
              <article key={item.id} className="list-row">
                <div>
                  <strong>{item.enterpriseName}</strong>
                  <p>{item.creditCode} · {item.cityCode}</p>
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
      ) : null}

      {section !== "decisions" ? (
        <section className="table-card">
          <div className="table-header">
            <h4>待审核队列</h4>
            <button className="ghost-button" type="button" onClick={() => void load()}>刷新</button>
          </div>
          <div className="workflow-note">建议先查看企业申报完整性，再决定通过或驳回。</div>
          <div className="table-list">
            {pendingRows.map((item) => (
              <article key={item.id} className="list-row review-row">
                <div>
                  <strong>{item.enterpriseName}</strong>
                  <p>{item.creditCode} · {item.cityCode}</p>
                </div>
                <div className="row-actions">
                  <button className="primary-button small" type="button" onClick={() => void handleApprove(item.id)}>通过</button>
                  <button className="ghost-button small" type="button" onClick={() => void handleReject(item.id)}>驳回</button>
                  <button className="ghost-button small" type="button" onClick={() => void openDetail(item.id)}>详情</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="workflow-grid">
        <article className="workflow-card">
          <div className="table-header"><h4>审核要点</h4></div>
          <div className="metric-list">
            <div><span>待审优先级</span><strong>高</strong></div>
            <div><span>平均处理时长</span><strong>15 分钟</strong></div>
            <div><span>退回率</span><strong>{dashboard?.rejectedCount ?? 0}</strong></div>
          </div>
        </article>
        <article className="workflow-card">
          <div className="table-header"><h4>联动结果</h4></div>
          <div className="metric-list">
            <div><span>同步省级汇总</span><strong>自动</strong></div>
            <div><span>企业通知</span><strong>自动回传</strong></div>
            <div><span>交换状态</span><strong>待确认</strong></div>
          </div>
        </article>
      </section>

      <SlideDrawer
        open={drawerOpen}
        title="备案详情"
        subtitle={detail?.filing.enterpriseName ?? ""}
        onClose={() => {
          setDrawerOpen(false);
          setDetail(null);
        }}
      >
        {detail ? (
          <div className="drawer-stack">
            <div className="drawer-block">
              <strong>备案信息</strong>
              <p>状态：{detail.filing.status}</p>
              <p>{detail.filing.creditCode}</p>
              <p>{detail.filing.cityCode}</p>
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
          </div>
        ) : (
          <p>正在加载详情...</p>
        )}
      </SlideDrawer>
    </div>
  );
}
