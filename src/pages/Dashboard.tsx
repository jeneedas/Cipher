import {
  Activity,
  ArrowRight,
  Clock3,
  FileSearch,
  Network,
  Plus,
  ShieldAlert,
  UsersRound,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const recentAnalyses = [
  {
    id: "ANL-0042",
    name: "Election narrative dataset",
    posts: "12,481",
    clusters: 7,
    risk: "High",
    time: "12 min ago",
  },
  {
    id: "ANL-0041",
    name: "Brand boycott conversation",
    posts: "8,204",
    clusters: 3,
    risk: "Medium",
    time: "2 hours ago",
  },
  {
    id: "ANL-0040",
    name: "Regional policy discourse",
    posts: "21,903",
    clusters: 11,
    risk: "High",
    time: "Yesterday",
  },
  {
    id: "ANL-0039",
    name: "Public health narrative",
    posts: "6,712",
    clusters: 2,
    risk: "Low",
    time: "2 days ago",
  },
]

const signals = [
  {
    icon: Clock3,
    title: "Temporal synchronisation",
    description: "184 accounts posted within repeated 90-second windows.",
    level: "high",
  },
  {
    icon: UsersRound,
    title: "Account overlap",
    description: "71% of cluster members amplified the same narrative set.",
    level: "medium",
  },
  {
    icon: Network,
    title: "Narrative convergence",
    description: "Six distinct phrases appeared across 2,341 related posts.",
    level: "high",
  },
]

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="page cipher-dashboard">
      <div className="page-header dashboard-header">
        <div>
          <h1>Overview</h1>
          <p>
            Behavioural coordination signals across your analysis workspace.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/analysis/new")}
        >
          <Plus size={15} strokeWidth={1.8} />
          New analysis
        </button>
      </div>

      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-card-top">
            <span>Analyses completed</span>
            <FileSearch size={16} strokeWidth={1.6} />
          </div>

          <strong>42</strong>
          <p>+8 this month</p>
        </article>

        <article className="metric-card">
          <div className="metric-card-top">
            <span>Posts processed</span>
            <Activity size={16} strokeWidth={1.6} />
          </div>

          <strong>49.3K</strong>
          <p>Across 12 datasets</p>
        </article>

        <article className="metric-card metric-card-warning">
          <div className="metric-card-top">
            <span>Coordination clusters</span>
            <Network size={16} strokeWidth={1.6} />
          </div>

          <strong>23</strong>
          <p>9 require review</p>
        </article>

        <article className="metric-card metric-card-danger">
          <div className="metric-card-top">
            <span>High-risk signals</span>
            <ShieldAlert size={16} strokeWidth={1.6} />
          </div>

          <strong>7</strong>
          <p>Detected this week</p>
        </article>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel analyses-panel">
          <div className="panel-header">
            <div>
              <h2>Recent analyses</h2>
              <p>Latest behavioural coordination scans.</p>
            </div>

            <button className="text-button">
              View all
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="analysis-table">
            <div className="analysis-table-head">
              <span>ANALYSIS</span>
              <span>POSTS</span>
              <span>CLUSTERS</span>
              <span>RISK</span>
              <span>UPDATED</span>
            </div>

            {recentAnalyses.map((analysis) => (
              <button
                className="analysis-row"
                key={analysis.id}
                onClick={() => navigate("/results")}
              >
                <div className="analysis-name">
                  <strong>{analysis.name}</strong>
                  <span>{analysis.id}</span>
                </div>

                <span className="mono-value">{analysis.posts}</span>

                <span className="mono-value">{analysis.clusters}</span>

                <span
                  className={`risk-badge risk-${analysis.risk.toLowerCase()}`}
                >
                  {analysis.risk}
                </span>

                <span className="row-time">{analysis.time}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-panel signals-panel">
          <div className="panel-header">
            <div>
              <h2>Active signals</h2>
              <p>Patterns requiring analyst attention.</p>
            </div>

            <span className="live-indicator">
              <i />
              LIVE
            </span>
          </div>

          <div className="signal-list">
            {signals.map(({ icon: Icon, title, description, level }) => (
              <div className="signal-item" key={title}>
                <div className={`signal-icon signal-icon-${level}`}>
                  <Icon size={15} strokeWidth={1.7} />
                </div>

                <div className="signal-content">
                  <strong>{title}</strong>
                  <p>{description}</p>
                </div>

                <span className={`signal-level signal-level-${level}`}>
                  {level}
                </span>
              </div>
            ))}
          </div>

          <button
            className="panel-action"
            onClick={() => navigate("/results")}
          >
            Inspect coordination signals
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      <section className="dashboard-panel methodology-panel">
        <div className="methodology-copy">
          <div className="methodology-icon">
            <Network size={17} strokeWidth={1.6} />
          </div>

          <div>
            <h2>Coordination, not truth classification</h2>
            <p>
              Cipher identifies unusual behavioural alignment through temporal,
              account-overlap and narrative-pattern analysis. It does not
              determine whether individual claims are true or false.
            </p>
          </div>
        </div>

        <span className="methodology-label">BEHAVIOURAL ANALYSIS</span>
      </section>
    </div>
  )
}

export default Dashboard