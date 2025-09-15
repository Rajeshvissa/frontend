import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";

const link = "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-sm font-medium";
const active = "bg-secondary";

export default function Sidebar() {
  const items = [
    { to: "/", label: "Dashboard", icon: "🏠" },
    { to: "/customers", label: "Customers", icon: "👤" },
    { to: "/orders", label: "Orders", icon: "🧾" },
    { to: "/campaigns", label: "Campaigns", icon: "📢" },
    { to: "/logs", label: "Logs", icon: "🗂️" },
  ];
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 p-4 gap-2">
      <div className="text-2xl font-bold px-2 py-4">miniCRM</div>
      <nav className="flex flex-col gap-2">
        {items.map(i => (
          <NavLink key={i.to} to={i.to}
            className={({isActive}) => cn(link, isActive && active)}>
            <span className="text-lg">{i.icon}</span>
            {i.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto text-xs text-muted-foreground px-2">© {new Date().getFullYear()} You</div>
    </aside>
  );
}
