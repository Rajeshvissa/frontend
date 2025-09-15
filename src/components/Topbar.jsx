import Button from "./ui/button";

export default function Topbar({ user }) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        <div className="md:hidden font-semibold">miniCRM</div>
        <div className="flex items-center gap-3">
          {user?.displayName && (
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.displayName}
            </span>
          )}
          <Button as="a" href="/auth/logout" variant="outline" size="sm">Logout</Button>
        </div>
      </div>
    </header>
  );
}
