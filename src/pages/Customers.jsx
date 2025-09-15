// frontend/src/pages/Customers.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Customers() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    api.get("/customers").then((r) => setList(r.data || [])).catch(() => setList([]));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/customers", { ...form });
      setForm({ name: "", email: "" });
      await load();
    } catch (err) {
      // optional: alert("Failed to add customer");
    } finally {
      setSubmitting(false);
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
            <h3 className="fw-bold text-primary mb-1">Customers</h3>
            <div className="text-muted">
              Manage your customer list and quickly add new contacts.
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
            Total: <strong className="ms-1">{list.length}</strong>
          </span>
        </div>

        {/* Add form */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "1rem" }}>
          <div className="card-body">
            <form className="row g-2 align-items-end" onSubmit={submit}>
              <div className="col-12 col-md-5">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  placeholder="e.g. Priya Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-12 col-md-5">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="e.g. priya@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="col-12 col-md-2 d-grid">
                <button className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        {list.length === 0 ? (
          <div
            className="text-center p-5"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)",
              border: "1px dashed #e5e7ef",
              borderRadius: "1rem",
              color: "#6b7280",
            }}
          >
            <div className="mb-2">No customers yet</div>
            <div className="small">
              Use the form above to add your first customer.
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "30%" }}>Name</th>
                      <th style={{ width: "35%" }}>Email</th>
                      <th style={{ width: "15%" }}>Total Spend</th>
                      <th style={{ width: "20%" }}>Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((c) => (
                      <tr key={c._id}>
                        <td className="fw-semibold">{c.name}</td>
                        <td className="text-muted">{c.email}</td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary">
                            ₹{Number(c.total_spend ?? 0).toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="text-muted">
                          {c.last_visit_date
                            ? new Date(c.last_visit_date).toLocaleDateString()
                            : "—"}
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
