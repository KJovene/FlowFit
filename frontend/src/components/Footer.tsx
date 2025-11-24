export function Footer() {
  return (
    <footer className="border-t border-neutral-850/90 bg-neutral-950/90">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span className="font-semibold tracking-tight text-neutral-100">
            FlowFit
          </span>
          <span className="text-neutral-600">•</span>
          <span>Sport à la maison, repensé.</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span>© 2025 FlowFit</span>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <button className="hover:text-neutral-300 transition-colors">
            Mentions légales
          </button>
          <button className="hover:text-neutral-300 transition-colors">
            Confidentialité
          </button>
          <button className="hover:text-neutral-300 transition-colors">
            Aide
          </button>
        </div>
      </div>
    </footer>
  );
}
