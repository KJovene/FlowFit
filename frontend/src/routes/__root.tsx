import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileNav } from "@/components/MobileNav";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-950 via-neutral-950 to-slate-950">
      {/* Top gradient glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-48 opacity-60 bg-gradient-to-b from-sky-500/20 via-cyan-400/10 to-transparent blur-3xl"></div>

      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
