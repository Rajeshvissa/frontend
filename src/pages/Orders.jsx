// frontend/src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Orders() {
  const [list, setList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_id: "", amount: "", status: "completed" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () =>
    api.get("/orders").then((r) => setList(r.data || [])).catch(() => setList([]));

  const loadCustomers = () =>
    api.get("/customers").then((r) => r.data || []).catch(() => []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ordersData, customersData] = await Promise.all([load(), loadCustomers()]);
        if (mounted) {
          // load() already set list; we just need customers here
          setCustomers(customersData);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/orders", {
        customer_id: form.customer_id,
        amount: Number(form.amount),
        status: form.status,
      });
      setForm({ customer_id: "", amount: "", status: "completed" });
      await load();
    } catch (err) {
      // optional: alert("Failed to add order");
    } finally {
      setSubmitting(false);
    }
  };

  const formatINR = (n) =>
    typeof n === "number"
      ? `₹${n.toLocaleString("en-IN")}`
      : `₹${Number(n || 0).toLocaleString("en-IN")}`;

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
            <h3 className="fw-bold text-primary mb-1">Orders</h3>
            <div className="text-muted">Create and review recent orders.</div>
          </div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
            Total: <strong className="ms-1">{list.length}</strong>
          </span>
        </div>

        {/* Create form */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "1rem" }}>
          <div className="card-body">
            <form className="row g-3 align-items-end" onSubmit={submit}>
              <div className="col-12 col-md-5">
                <label className="form-label">Customer</label>
                <select
                  className="form-select"
                  required
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                >
                  <option value="">Choose…</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label">Amount</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
              <div className="col-12 col-md-2 d-grid">
                <button className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Table / Empty / Loading */}
        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" aria-hidden="true" />
            <span className="ms-2 text-muted">Loading...</span>
          </div>
        ) : list.length === 0 ? (
          <div
            className="text-center p-5"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)",
              border: "1px dashed #e5e7ef",
              borderRadius: "1rem",
              color: "#6b7280",
            }}
          >
            <div className="mb-2">No orders yet</div>
            <div className="small">Use the form above to add your first order.</div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "28%" }}>Customer</th>
                      <th style={{ width: "32%" }}>Email</th>
                      <th style={{ width: "20%" }}>Amount</th>
                      <th style={{ width: "20%" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((o) => (
                      <tr key={o._id}>
                        <td className="fw-semibold">{o.customer_id?.name || "—"}</td>
                        <td className="text-muted">{o.customer_id?.email || "—"}</td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary">
                            {formatINR(o.amount)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              o.status === "completed"
                                ? "text-bg-success"
                                : "text-bg-secondary"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
