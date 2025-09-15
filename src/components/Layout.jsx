export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50">
      <div className="mx-auto max-w-[1200px] p-6">{children}</div>
    </div>
  );
}
