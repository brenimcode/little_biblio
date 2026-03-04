import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Home, Users, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Início", icon: Home },
  { to: "/books", label: "Livros", icon: BookOpen },
  { to: "/members", label: "Membros", icon: Users },
  { to: "/loans", label: "Empréstimos", icon: ArrowLeftRight },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:bg-sidebar md:p-6">
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-xl font-bold text-sidebar-foreground">
            <img src="/favicon.png" alt="Little Biblio" className="h-14 w-14" />
            Little Biblio
          </h1>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                location.pathname === link.to
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="mx-auto max-w-5xl p-4 md:p-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-card md:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
              location.pathname === link.to
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
