import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import NewAnalysis from "./pages/NewAnalysis"
import Results from "./pages/Results"

function Placeholder({ title }: { title: string }) {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>This workspace is being prepared.</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/analyses"
            element={<Placeholder title="Analyses" />}
          />

          <Route path="/analysis/new" element={<NewAnalysis />} />

          <Route path="/results" element={<Results />} />

          <Route
            path="/clusters"
            element={<Placeholder title="Clusters" />}
          />

          <Route
            path="/network"
            element={<Placeholder title="Network" />}
          />

          <Route
            path="/posts"
            element={<Placeholder title="Posts" />}
          />

          <Route
            path="/accounts"
            element={<Placeholder title="Accounts" />}
          />

          <Route
            path="/settings"
            element={<Placeholder title="Settings" />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App