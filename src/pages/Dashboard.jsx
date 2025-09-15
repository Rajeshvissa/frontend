// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

function StatCard({ label, value, icon }) {
  return (
    <div className="col-12 col-md-6 col-lg-3">
      <div
        className="card shadow-sm h-100 border-0"
        style={{
          borderRadius: "1rem",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        <div className="card-body d-flex flex-column align-items-start">
          <div className="d-flex align-items-center justify-content-between w-100 mb-2">
            <span className="text-muted small">{label}</span>
            <span className="fs-4 text-primary">{icon}</span>
          </div>
          <div className="fs-2 fw-bold mt-auto">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    campaigns: 0,
    orders: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [c, cmp, o, logs] = await Promise.all([
          api.get("/customers"),
          api.get("/api/campaigns"),
          api.get("/orders"),
          api.get("/communication?limit=100&page=1"),
        ]);

        const deliveredCount = Array.isArray(logs?.data?.logs)
          ? logs.data.logs.filter((l) => l.status === "SENT").length
          : 0;

        if (mounted) {
          setStats({
            customers: Array.isArray(c?.data) ? c.data.length : 0,
            campaigns: Array.isArray(cmp?.data) ? cmp.data.length : 0,
            orders: Array.isArray(o?.data) ? o.data.length : 0,
            delivered: deliveredCount,
          });
        }
      } catch (err) {
        // optional: console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="min-vh-100 py-4"
      style={{
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #ffffff 60%)",
      }}
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="fw-bold text-primary mb-0">Dashboard</h3>
        </div>

        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
              aria-hidden="true"
            />
            <span className="ms-2 text-muted">Loading...</span>
          </div>
        ) : (
          <div className="row g-4">
            <StatCard label="Customers" value={stats.customers} icon="👥" />
            <StatCard label="Campaigns" value={stats.campaigns} icon="📢" />
            <StatCard label="Orders" value={stats.orders} icon="🛒" />
            <StatCard label="Delivered" value={stats.delivered} icon="✅" />
          </div>
        )}
      </div>
    </div>
  );
}
