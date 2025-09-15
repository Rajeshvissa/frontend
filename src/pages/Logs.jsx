// frontend/src/pages/Logs.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const params = new URLSearchParams(location.search);
  const [campaign, setCampaign] = useState(params.get("campaign") || "");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      if (campaign) {
        const r = await api.get(`/api/campaigns/${campaign}/logs`);
        setLogs(r.data || []);
      } else {
        const r = await api.get(`/communication?page=${page}&limit=20`);
        setLogs(r.data.logs || []);
      }
    } catch (e) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, campaign]);

  const badge = (s) => {
    const map = { SENT: "success", PENDING: "warning", FAILED: "danger" };
    return (
      <span className={`badge text-bg-${map[s] || "secondary"}`}>
        {s}
      </span>
    );
  };

  return (
    <div
      className="min-vh-100 py-4"
      style={{
        background:
          "radial-gradient(1200px 600px at 90% -20%, #eaf2ff 0%, rgba(234,242,255,0) 60%), linear-gradient(135deg, #f6f8ff 0%, #ffffff 70%)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold text-primary mb-1">Communication Logs</h3>
            <div className="text-muted">
              View delivery status for messages across campaigns.
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
            Showing: <strong className="ms-1">{logs.length}</strong>
          </span>
        </div>

        {/* Controls */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "1rem" }}>
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6 col-lg-4">
                <label className="form-label mb-1">Filter by Campaign ID</label>
                <input
                  className="form-control"
                  placeholder="e.g. 68c5cd00dcca9aa03f59ed59"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                />
              </div>
              {!campaign && (
                <div className="col-12 col-md-auto">
                  <label className="form-label mb-1 d-block">Pagination</label>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                  <span className="ms-2 text-muted small">Page {page}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table / Loading / Empty */}
        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" aria-hidden="true" />
            <span className="ms-2 text-muted">Loading logs…</span>
          </div>
        ) : logs.length === 0 ? (
          <div
            className="text-center p-5"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)",
              border: "1px dashed #e5e7ef",
              borderRadius: "1rem",
              color: "#6b7280",
            }}
          >
            <div className="mb-2">No logs to show</div>
            <div className="small">Try a different page or enter a campaign ID above.</div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "20%" }}>Customer</th>
                      <th style={{ width: "24%" }}>Email</th>
                      <th style={{ width: "20%" }}>Campaign</th>
                      <th style={{ width: "26%" }}>Message</th>
                      <th style={{ width: "10%" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l) => (
                      <tr key={l._id}>
                        <td className="fw-semibold">{l.customer_id?.name || "—"}</td>
                        <td className="text-muted">{l.customer_id?.email || "—"}</td>
                        <td className="text-muted">{l.campaign_id?.name || "—"}</td>
                        <td className="text-truncate" style={{ maxWidth: 380 }}>
                          {l.message}
                        </td>
                        <td>{badge(l.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tiny hint */}
        {!campaign && (
          <div className="text-muted small mt-3">
            Tip: Use the campaign ID filter to view logs for a specific campaign without pagination.
          </div>
        )}
      </div>
    </div>
  );
}
