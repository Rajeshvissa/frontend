import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./hooks/useAuth"; 
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";   // 👈 make sure this file exists
import Campaigns from "./pages/Campaigns";
import Logs from "./pages/Logs";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";

function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container py-5">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar user={user} />
      <div className="container">
        <div className="mb-3 d-flex gap-2">
          <Link className="btn btn-outline-secondary btn-sm" to="/dashboard">Dashboard</Link>
          <Link className="btn btn-outline-secondary btn-sm" to="/customers">Customers</Link>
          <Link className="btn btn-outline-secondary btn-sm" to="/orders">Orders</Link>
          <Link className="btn btn-outline-secondary btn-sm" to="/campaigns">Campaigns</Link>
          <Link className="btn btn-outline-secondary btn-sm" to="/logs">Logs</Link>
        </div>
      </div>
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/customers" element={<Protected><Customers /></Protected>} />
        <Route path="/orders" element={<Protected><Orders /></Protected>} />
        <Route path="/campaigns" element={<Protected><Campaigns /></Protected>} />
        <Route path="/logs" element={<Protected><Logs /></Protected>} />

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
