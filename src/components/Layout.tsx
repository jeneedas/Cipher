import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"

type LayoutProps = {
  children: ReactNode
}

const pageNames: Record<string, string> = {
  "/": "Overview",
  "/analyses": "Analyses",
  "/analysis/new": "New analysis",
  "/results": "Analysis results",
  "/clusters": "Clusters",
  "/network": "Network",
  "/posts": "Posts",
  "/accounts": "Accounts",
  "/settings": "Settings",
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const currentPage = pageNames[location.pathname] ?? "Workspace"

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Cipher</span>
            <ChevronRight size={13} strokeWidth={1.7} />
            <strong>{currentPage}</strong>
          </div>

          <div className="environment-status">
            <i />
            Analysis environment active
          </div>
        </header>

        <main className="workspace">{children}</main>
      </div>
    </div>
  )
}

export default Layout