// frontend/src/pages/Campaigns.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [name, setName] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [inactiveDays, setInactiveDays] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Logs state: { [campaignId]: { open: bool, loading: bool, items: [] } }
  const [logsById, setLogsById] = useState({});

  const fetchCampaigns = async (tag = "") => {
    try {
      setLoading(true);
      const res = await api.get("/api/campaigns", { params: { tag } });
      setCampaigns(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error fetching campaigns:", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Live suggestions on name/rules change
  useEffect(() => {
    const run = async () => {
      try {
        if (!name && !minSpend && !inactiveDays) {
          setSuggestedTags([]);
          return;
        }
        const res = await api.post("/api/campaigns/suggest-tags", {
          name,
          rules: { min_spend: minSpend, inactive_days: inactiveDays },
        });
        setSuggestedTags(res.data?.tags || []);
      } catch (err) {
        console.error("❌ suggest-tags error:", err);
        setSuggestedTags([]);
      }
    };
    run();
  }, [name, minSpend, inactiveDays]);

  const handleCreate = async () => {
    try {
      setCreating(true);
      await api.post("/api/campaigns", {
        name,
        rules: { min_spend: minSpend, inactive_days: inactiveDays },
      });
      setName("");
      setMinSpend("");
      setInactiveDays("");
      await fetchCampaigns(tagFilter);
    } catch (err) {
      console.error("❌ Error creating campaign:", err);
      alert(err?.response?.data?.error || "Failed to create campaign");
    } finally {
      setCreating(false);
    }
  };

  const handleFilter = () => fetchCampaigns(tagFilter);
  const handleClear = () => {
    setTagFilter("");
    fetchCampaigns();
  };

  // Clicking a suggested tag pastes/appends into the Name field
  const handleTagClick = (tag) => {
    if (!name) {
      setName(tag);
    } else if (!name.toLowerCase().includes(tag.toLowerCase())) {
      setName((prev) => prev + " " + tag);
    }
  };

  // Toggle and (lazy) load logs for a campaign
  const toggleLogs = async (campaignId) => {
    setLogsById((prev) => {
      const current = prev[campaignId] || { open: false, loading: false, items: [] };
      return { ...prev, [campaignId]: { ...current, open: !current.open } };
    });

    // If already loaded once, don't refetch
    const existing = logsById[campaignId];
    if (existing && existing.items && existing.items.length) return;

    try {
      setLogsById((prev) => ({
        ...prev,
        [campaignId]: { ...(prev[campaignId] || {}), loading: true, open: true, items: [] },
      }));
      const res = await api.get(`/api/campaigns/${campaignId}/logs`);
      const items = Array.isArray(res.data) ? res.data : [];
      setLogsById((prev) => ({
        ...prev,
        [campaignId]: { ...(prev[campaignId] || {}), loading: false, open: true, items },
      }));
    } catch (err) {
      console.error("❌ Error loading logs:", err);
      setLogsById((prev) => ({
        ...prev,
        [campaignId]: { ...(prev[campaignId] || {}), loading: false, open: true, items: [] },
      }));
    }
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
            <h3 className="fw-bold text-primary mb-1">Campaigns</h3>
            <div className="text-muted">Create campaigns, auto-tag, and view delivery logs.</div>
          </div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
            Total: <strong className="ms-1">{campaigns.length}</strong>
          </span>
        </div>

        {/* Create form */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "1rem" }}>
          <div className="card-body">
            <h5 className="card-title mb-3">Create Campaign</h5>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-lg">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Win back high spenders"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-6 col-lg-2">
                <label className="form-label">Min Spend</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 1000"
                  value={minSpend}
                  onChange={(e) => setMinSpend(e.target.value)}
                />
              </div>
              <div className="col-6 col-lg-2">
                <label className="form-label">Inactive Days</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 30"
                  value={inactiveDays}
                  onChange={(e) => setInactiveDays(e.target.value)}
                />
              </div>
              <div className="col-12 col-lg-auto d-grid">
                <button className="btn btn-primary" onClick={handleCreate} disabled={creating}>
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </div>


            <div className="mt-3">
              <div className="text-muted small mb-1">Suggested tags</div>
              {suggestedTags.length > 0 ? (
                <div className="d-flex gap-2 flex-wrap">
                  {suggestedTags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleTagClick(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-muted small">No suggestions yet</span>
              )}
            </div>
          </div>
        </div> 

        {/* Filter */}
        <div className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: 280 }}
            placeholder="Filter by tag or name (e.g. Win-back)"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
          <button className="btn btn-outline-primary" onClick={handleFilter}>
            Filter
          </button>
          <button className="btn btn-outline-secondary" onClick={handleClear}>
            Clear
          </button>
        </div>

        {/* Campaign list / Loading / Empty */}
        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" aria-hidden="true" />
            <span className="ms-2 text-muted">Loading campaigns…</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div
            className="text-center p-5"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)",
              border: "1px dashed #e5e7ef",
              borderRadius: "1rem",
              color: "#6b7280",
            }}
          >
            <div className="mb-2">No campaigns</div>
            <div className="small">Use the form above to create your first campaign.</div>
          </div>
        ) : (
          <div className="row g-3">
            {campaigns.map((c) => {
              const logState = logsById[c._id] || { open: false, loading: false, items: [] };
              return (
                <div className="col-12" key={c._id}>
                  <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
                    <div className="card-body d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="mb-1">{c.name}</h6>
                        <div className="text-muted small">
                          Audience: <strong>{c.audience_size}</strong>{" "}
                          <span className="mx-2">•</span>
                          Tags: {Array.isArray(c.tags) && c.tags.length ? c.tags.join(", ") : "—"}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => toggleLogs(c._id)}
                        >
                          {logState.open ? "Hide Logs" : "View Logs"}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible logs */}
                    {logState.open && (
                      <div className="card-body pt-0">
                        {logState.loading ? (
                          <div className="d-flex align-items-center text-muted small py-3">
                            <div
                              className="spinner-border spinner-border-sm text-primary me-2"
                              role="status"
                              aria-hidden="true"
                            />
                            Loading logs…
                          </div>
                        ) : logState.items.length === 0 ? (
                          <div
                            className="text-center p-4"
                            style={{
                              background:
                                "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)",
                              border: "1px dashed #e5e7ef",
                              borderRadius: "0.75rem",
                              color: "#6b7280",
                            }}
                          >
                            <div className="mb-1">No logs for this campaign yet</div>
                            <div className="small">
                              New deliveries will appear here as the vendor sends receipts.
                            </div>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th style={{ width: "24%" }}>Customer</th>
                                  <th style={{ width: "30%" }}>Email</th>
                                  <th style={{ width: "28%" }}>Message</th>
                                  <th style={{ width: "10%" }}>Status</th>
                                  <th style={{ width: "8%" }}>Time</th>
                                </tr>
                              </thead>
                              <tbody>
                                {logState.items.map((log) => (
                                  <tr key={log._id}>
                                    <td className="fw-semibold">
                                      {log.customer_id?.name || "—"}
                                    </td>
                                    <td className="text-muted">{log.customer_id?.email || "—"}</td>
                                    <td className="text-truncate" style={{ maxWidth: 280 }}>
                                      {log.message}
                                    </td>
                                    <td>
                                      <span
                                        className={`badge ${
                                          log.status === "SENT"
                                            ? "text-bg-success"
                                            : log.status === "FAILED"
                                            ? "text-bg-danger"
                                            : "text-bg-secondary"
                                        }`}
                                      >
                                        {log.status}
                                      </span>
                                    </td>
                                    <td className="text-muted small">
                                      {log.updatedAt
                                        ? new Date(log.updatedAt).toLocaleTimeString()
                                        : ""}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
