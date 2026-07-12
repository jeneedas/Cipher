import {
  Activity,
  Boxes,
  CircleUserRound,
  FileSearch,
  LayoutDashboard,
  Network,
  Settings,
  TableProperties,
} from "lucide-react"
import { NavLink } from "react-router-dom"

const navigation = [
  {
    section: "GENERAL",
    items: [
      {
        label: "Overview",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: "ANALYSIS",
    items: [
      {
        label: "Analyses",
        path: "/analyses",
        icon: FileSearch,
      },
      {
        label: "Clusters",
        path: "/clusters",
        icon: Boxes,
      },
      {
        label: "Network",
        path: "/network",
        icon: Network,
      },
    ],
  },
  {
    section: "DATA",
    items: [
      {
        label: "Posts",
        path: "/posts",
        icon: TableProperties,
      },
      {
        label: "Accounts",
        path: "/accounts",
        icon: CircleUserRound,
      },
    ],
  },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-symbol">C</div>

        <div className="brand-copy">
          <span className="brand-name">Cipher</span>
          <span className="brand-version">MVP</span>
        </div>
      </div>

      <div className="sidebar-navigation">
        {navigation.map((group) => (
          <div className="nav-group" key={group.section}>
            <p className="nav-section-label">{group.section}</p>

            <nav className="nav-list">
              {group.items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                >
                  <Icon size={16} strokeWidth={1.7} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-link ${isActive ? "nav-link-active" : ""}`
          }
        >
          <Settings size={16} strokeWidth={1.7} />
          <span>Settings</span>
        </NavLink>

        <div className="engine-status">
          <Activity size={14} strokeWidth={1.8} />

          <div>
            <span>Detection engine</span>

            <p>
              <i />
              Operational
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar