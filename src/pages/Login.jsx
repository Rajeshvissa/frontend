export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          "radial-gradient(1200px 600px at 80% -10%, #eaf2ff 0%, rgba(234,242,255,0) 60%), radial-gradient(900px 500px at -10% 110%, #f7f8fb 0%, rgba(247,248,251,0) 60%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <div className="text-center mb-4">
              {/* Simple brand lockup */}
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: 56,
                  height: 56,
                  background: "#edf2ff",
                  boxShadow: "0 6px 18px rgba(33, 82, 255, 0.12)",
                }}
              >
                <span className="fw-bold" style={{ color: "#1e40af" }}>
                  m
                </span>
              </div>
              <div className="mt-2">
                <h1 className="h4 mb-0">miniCRM</h1>
                <div className="text-muted small">Sign in to continue</div>
              </div>
            </div>

            <div className="card">
              <div className="card-body p-4">
                <a
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                  href={`${API}/auth/google`}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    width="18"
                    height="18"
                  />
                  Continue with Google
                </a>

                <div className="text-center text-muted small mt-3">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-decoration-none">
                    Terms
                  </a>{" "}
                  &{" "}
                  <a href="#" className="text-decoration-none">
                    Privacy Policy
                  </a>
                  .
                </div>

                {/* subtle divider */}
                <div className="d-flex align-items-center my-3">
                  <div className="flex-grow-1 border-top" />
                  <span className="px-2 text-muted small">or</span>
                  <div className="flex-grow-1 border-top" />
                </div>

                {/* trust / hints */}
                <ul className="list-unstyled small text-muted mb-0">
                  <li className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-circle"
                      style={{
                        width: 6,
                        height: 6,
                        background: "#22c55e",
                        display: "inline-block",
                      }}
                    />
                    Secure OAuth via Google
                  </li>
                  <li className="d-flex align-items-center gap-2 mt-1">
                    <span
                      className="rounded-circle"
                      style={{
                        width: 6,
                        height: 6,
                        background: "#22c55e",
                        display: "inline-block",
                      }}
                    />
                    Your session stays on this device
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center text-muted small mt-3">
              Need help? <a href="#" className="text-decoration-none">Contact support</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
