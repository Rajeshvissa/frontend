export default function Navbar({ user }) {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom mb-4">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">miniCRM</a>
        <div className="ms-auto d-flex align-items-center gap-3">
          {user?.displayName && <span className="text-secondary">{user.displayName}</span>}
          <a className="btn btn-outline-secondary btn-sm" href="/auth/logout">Logout</a>
        </div>
      </div>
    </nav>
  );
}
