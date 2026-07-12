import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  FileText,
  SlidersHorizontal,
} from "lucide-react";

type UploadedPost = {
  [key: string]: unknown;
};

type AnalysisLocationState = {
  posts?: UploadedPost[];
  analysisName?: string;
  timeWindow?: number;
  similarity?: number;
};

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as AnalysisLocationState | null;

  const posts = state?.posts ?? [];
  const analysisName = state?.analysisName ?? "Untitled analysis";
  const timeWindow = state?.timeWindow ?? 0;
  const similarity = state?.similarity ?? 0;

  if (posts.length === 0) {
    return (
      <div className="results-page">
        <div className="results-empty">
          <div className="results-empty-icon">
            <FileText size={20} />
          </div>

          <h1>No analysis data</h1>

          <p>
            Upload a dataset and run an analysis to inspect coordination
            signals.
          </p>

          <button
            className="results-primary-button"
            onClick={() => navigate("/new-analysis")}
          >
            New analysis
          </button>
        </div>
      </div>
    );
  }

  const previewPosts = posts.slice(0, 5);

  return (
    <div className="results-page">
      <div className="results-header">
        <button
          className="results-back-button"
          onClick={() => navigate("/new-analysis")}
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="results-title-row">
          <div>
            <span className="results-eyebrow">ANALYSIS RESULTS</span>
            <h1>{analysisName}</h1>

            <p>
              Dataset received successfully. Coordination analysis is ready to
              begin.
            </p>
          </div>

          <span className="results-status">
            <span className="results-status-dot" />
            Dataset loaded
          </span>
        </div>
      </div>

      <div className="results-summary-grid">
        <div className="results-summary-card">
          <div className="results-summary-label">
            <FileText size={14} />
            Posts received
          </div>

          <strong>{posts.length.toLocaleString()}</strong>
          <span>Valid dataset records</span>
        </div>

        <div className="results-summary-card">
          <div className="results-summary-label">
            <Clock3 size={14} />
            Time window
          </div>

          <strong>{timeWindow}s</strong>
          <span>Temporal synchronisation threshold</span>
        </div>

        <div className="results-summary-card">
          <div className="results-summary-label">
            <SlidersHorizontal size={14} />
            Similarity threshold
          </div>

          <strong>{similarity}%</strong>
          <span>Narrative similarity requirement</span>
        </div>
      </div>

      <div className="results-panel">
        <div className="results-panel-header">
          <div>
            <h2>Dataset preview</h2>
            <p>First five records received from the uploaded file.</p>
          </div>

          <span>{posts.length} records</span>
        </div>

        <div className="results-table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Record data</th>
              </tr>
            </thead>

            <tbody>
              {previewPosts.map((post, index) => (
                <tr key={index}>
                  <td>{String(index + 1).padStart(2, "0")}</td>

                  <td>
                    <code>{JSON.stringify(post)}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="results-notice">
        <div className="results-notice-icon">
          <SlidersHorizontal size={16} />
        </div>

        <div>
          <strong>Dataset ingestion successful</strong>
          <p>
            Cipher has received the uploaded records. Behavioural coordination
            detection will analyse temporal proximity and narrative similarity.
          </p>
        </div>
      </div>
    </div>
  );
} 