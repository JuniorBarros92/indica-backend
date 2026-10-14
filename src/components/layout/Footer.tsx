import { House } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-white">
            <House size={16} />
          </span>
          Vizinho Indica
        </div>
        <p className="text-sm text-slate-500">
          Bons profissionais. Boas relações. Tudo pertinho de você.
        </p>
        <span className="text-xs text-slate-400">© 2026 Vizinho Indica</span>
      </div>
    </footer>
  );
}
