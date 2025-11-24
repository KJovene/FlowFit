import { Home, ListChecks, User } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Accueil",
      icon: Home,
      path: "/",
    },
    {
      name: "Programmes",
      icon: ListChecks,
      path: "/programmes",
    },
    {
      name: "Profil",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 text-[0.7rem] transition-colors",
                isActive ? "text-sky-300" : "text-neutral-400"
              )}
            >
              <Icon className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
