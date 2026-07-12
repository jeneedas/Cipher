import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Papa from "papaparse"
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock3,
  FileSpreadsheet,
  Network,
  Settings2,
  Upload,
  X,
} from "lucide-react"
import type { DatasetStats, Post } from "../types"

type UploadedDataset = {
  name: string
  size: string
}

type CsvRow = {
  account_id?: string
  text?: string
  timestamp?: string
}

function NewAnalysis() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [dataset, setDataset] = useState<UploadedDataset | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<DatasetStats | null>(null)
  const [datasetError, setDatasetError] = useState("")
  const [analysisName, setAnalysisName] = useState("")
  const [timeWindow, setTimeWindow] = useState("90")
  const [similarity, setSimilarity] = useState("80")

  const resetDataset = () => {
    setDataset(null)
    setPosts([])
    setStats(null)
    setDatasetError("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFile = (file?: File) => {
    if (!file) return

    setDatasetError("")

    if (!file.name.toLowerCase().endsWith(".csv")) {
      resetDataset()
      setDatasetError("Cipher currently accepts CSV datasets only.")
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      resetDataset()
      setDatasetError("Dataset exceeds the 25 MB upload limit.")
      return
    }

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (result) => {
        const fields = result.meta.fields ?? []

        const requiredFields = ["account_id", "text", "timestamp"]

        const missingFields = requiredFields.filter(
          (field) => !fields.includes(field),
        )

        if (missingFields.length > 0) {
          resetDataset()

          setDatasetError(
            `Missing required fields: ${missingFields.join(", ")}`,
          )

          return
        }

        const validPosts: Post[] = []

        for (const row of result.data) {
          const accountId = row.account_id?.trim()
          const text = row.text?.trim()
          const timestamp = row.timestamp?.trim()

          if (!accountId || !text || !timestamp) {
            continue
          }

          const parsedDate = new Date(timestamp)

          if (Number.isNaN(parsedDate.getTime())) {
            continue
          }

          validPosts.push({
            account_id: accountId,
            text,
            timestamp,
          })
        }

        if (validPosts.length === 0) {
          resetDataset()

          setDatasetError(
            "No valid posts were found in the uploaded dataset.",
          )

          return
        }

        const sortedPosts = [...validPosts].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime(),
        )

        const uniqueAccounts = new Set(
          validPosts.map((post) => post.account_id),
        )

        const datasetStats: DatasetStats = {
          totalPosts: validPosts.length,
          uniqueAccounts: uniqueAccounts.size,
          earliestPost: sortedPosts[0].timestamp,
          latestPost: sortedPosts[sortedPosts.length - 1].timestamp,
        }

        const size =
          file.size < 1024 * 1024
            ? `${(file.size / 1024).toFixed(1)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

        setDataset({
          name: file.name,
          size,
        })

        setPosts(validPosts)
        setStats(datasetStats)

        if (!analysisName) {
          setAnalysisName(file.name.replace(/\.csv$/i, ""))
        }
      },

      error: () => {
        resetDataset()

        setDatasetError(
          "Cipher could not read this dataset. Check the CSV format.",
        )
      },
    })
  }

  const handleRunAnalysis = () => {
    if (!dataset || posts.length === 0) {
      setDatasetError(
        "Upload a valid dataset before running an analysis.",
      )

      return
    }

    navigate("/results", {
      state: {
        posts,
        analysisName,
        timeWindow: Number(timeWindow),
        similarity: Number(similarity),
      },
    })
  }

  return (
    <div className="page new-analysis-page">
      <div className="page-header">
        <div>
          <h1>New analysis</h1>
          <p>
            Configure a behavioural coordination scan for a post dataset.
          </p>
        </div>
      </div>

      <div className="analysis-workspace">
        <main className="analysis-config">
          <section className="dashboard-panel analysis-section">
            <div className="analysis-section-header">
              <div className="section-number">01</div>

              <div>
                <h2>Dataset</h2>
                <p>Upload the post collection Cipher should analyse.</p>
              </div>
            </div>

            {!dataset ? (
              <div
                className="dataset-dropzone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  handleFile(event.dataTransfer.files[0])
                }}
              >
                <div className="dropzone-icon">
                  <Upload size={18} strokeWidth={1.5} />
                </div>

                <strong>Upload post dataset</strong>

                <p>
                  Drop a CSV file here or click to select a dataset from your
                  computer.
                </p>

                <span>CSV · MAX 25 MB</span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={(event) =>
                    handleFile(event.target.files?.[0])
                  }
                />
              </div>
            ) : (
              <div className="uploaded-dataset">
                <div className="dataset-file-icon">
                  <FileSpreadsheet size={18} strokeWidth={1.6} />
                </div>

                <div className="dataset-file-info">
                  <strong>{dataset.name}</strong>

                  <span>
                    {dataset.size} · {posts.length.toLocaleString()} valid posts
                  </span>
                </div>

                <span className="dataset-ready">
                  <Check size={12} />
                  VALIDATED
                </span>

                <button
                  className="dataset-remove"
                  onClick={resetDataset}
                  aria-label="Remove dataset"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {datasetError && (
              <div className="dataset-error">
                <AlertCircle size={14} strokeWidth={1.7} />
                <span>{datasetError}</span>
              </div>
            )}

            <div className="dataset-schema">
              <span className="schema-label">EXPECTED FIELDS</span>

              <div className="schema-fields">
                <code>account_id</code>
                <code>text</code>
                <code>timestamp</code>
              </div>

              <p>
                Each row should represent one post. Additional fields are
                preserved but ignored during the initial coordination scan.
              </p>
            </div>

            {stats && (
              <div className="dataset-stat-grid">
                <div>
                  <span>VALID POSTS</span>
                  <strong>{stats.totalPosts.toLocaleString()}</strong>
                </div>

                <div>
                  <span>ACCOUNTS</span>
                  <strong>{stats.uniqueAccounts.toLocaleString()}</strong>
                </div>

                <div>
                  <span>EARLIEST POST</span>
                  <strong>
                    {new Date(stats.earliestPost).toLocaleDateString()}
                  </strong>
                </div>

                <div>
                  <span>LATEST POST</span>
                  <strong>
                    {new Date(stats.latestPost).toLocaleDateString()}
                  </strong>
                </div>
              </div>
            )}
          </section>

          <section className="dashboard-panel analysis-section">
            <div className="analysis-section-header">
              <div className="section-number">02</div>

              <div>
                <h2>Analysis configuration</h2>
                <p>Define how Cipher should identify coordination signals.</p>
              </div>
            </div>

            <div className="analysis-form">
              <label className="analysis-field analysis-field-full">
                <span>ANALYSIS NAME</span>

                <input
                  type="text"
                  value={analysisName}
                  onChange={(event) =>
                    setAnalysisName(event.target.value)
                  }
                  placeholder="e.g. Regional narrative dataset"
                />
              </label>

              <label className="analysis-field">
                <span>TEMPORAL WINDOW</span>

                <div className="input-with-unit">
                  <Clock3 size={14} strokeWidth={1.5} />

                  <input
                    type="number"
                    min="1"
                    value={timeWindow}
                    onChange={(event) =>
                      setTimeWindow(event.target.value)
                    }
                  />

                  <small>SECONDS</small>
                </div>

                <p>
                  Posts within this interval are evaluated for synchronisation.
                </p>
              </label>

              <label className="analysis-field">
                <span>TEXT SIMILARITY THRESHOLD</span>

                <div className="input-with-unit">
                  <Network size={14} strokeWidth={1.5} />

                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={similarity}
                    onChange={(event) =>
                      setSimilarity(event.target.value)
                    }
                  />

                  <small>%</small>
                </div>

                <p>
                  Minimum narrative similarity required to associate posts.
                </p>
              </label>
            </div>
          </section>
        </main>

        <aside className="analysis-sidebar">
          <section className="dashboard-panel scan-summary">
            <div className="scan-summary-header">
              <Settings2 size={15} strokeWidth={1.6} />

              <h2>Scan configuration</h2>
            </div>

            <div className="scan-summary-list">
              <div>
                <span>Dataset</span>
                <strong>
                  {dataset ? dataset.name : "Not selected"}
                </strong>
              </div>

              <div>
                <span>Valid posts</span>
                <strong>{posts.length.toLocaleString()}</strong>
              </div>

              <div>
                <span>Temporal window</span>
                <strong>{timeWindow} sec</strong>
              </div>

              <div>
                <span>Similarity threshold</span>
                <strong>{similarity}%</strong>
              </div>

              <div>
                <span>Detection signals</span>
                <strong>3 active</strong>
              </div>
            </div>

            <button
              className="run-analysis-button"
              onClick={handleRunAnalysis}
              disabled={!dataset || posts.length === 0}
            >
              Run analysis
              <ArrowRight size={14} />
            </button>

            {!dataset && (
              <p className="run-analysis-hint">
                A valid CSV dataset is required before analysis can begin.
              </p>
            )}
          </section>

          <section className="dashboard-panel detection-info">
            <span className="detection-info-label">DETECTION MODEL</span>

            <h3>Behavioural coordination</h3>

            <p>
              Cipher compares posting time, narrative similarity and recurring
              account overlap to identify unusual behavioural alignment.
            </p>

            <div className="detection-signals">
              <span>
                <i />
                Temporal synchronisation
              </span>

              <span>
                <i />
                Narrative similarity
              </span>

              <span>
                <i />
                Account overlap
              </span>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default NewAnalysis