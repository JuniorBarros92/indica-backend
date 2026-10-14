import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, House, Menu, Search, X } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-elegant">
            <House size={21} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-ink">
            Vizinho<span className="text-brand-500"> Indica</span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[.19em] text-slate-400">
              Confiança mora perto
            </span>
          </span>
        </Link>
        <form
          className="mx-8 hidden max-w-md flex-1 items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 focus-within:border-brand-500 focus-within:bg-white md:flex"
          onSubmit={search}
        >
          <Search size={17} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="O que você precisa hoje?"
            className="ml-2 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <button className="rounded-full bg-brand-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-600">
            Buscar
          </button>
        </form>
        <nav className="hidden items-center gap-2 sm:flex">
          <Link
            to="/dashboard/favoritos"
            className="rounded-full p-2.5 text-slate-500 hover:bg-slate-100 hover:text-brand-600"
            title="Favoritos"
          >
            <Heart size={19} />
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Minha conta
          </Link>
          <Link
            to="/auth"
            className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-bold text-white shadow-elegant transition hover:-translate-y-0.5"
          >
            Entrar <ArrowRight size={15} className="ml-1 inline" />
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl p-2 hover:bg-slate-100 sm:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white p-4 sm:hidden">
          <form onSubmit={(event) => { search(event); setOpen(false); }} className="mb-3 flex gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-xl border p-3 text-sm"
              placeholder="Buscar serviço"
            />
            <button className="rounded-xl bg-brand-500 px-4 text-white">
              <Search size={18} />
            </button>
          </form>
          <Link
            onClick={() => setOpen(false)}
            className="block rounded-xl p-3 font-semibold"
            to="/dashboard"
          >
            Minha conta
          </Link>
          <Link
            onClick={() => setOpen(false)}
            className="block rounded-xl p-3 font-semibold"
            to="/dashboard/favoritos"
          >
            Favoritos
          </Link>
          <Link
            onClick={() => setOpen(false)}
            className="block rounded-xl p-3 font-semibold text-brand-600"
            to="/auth"
          >
            Entrar ou cadastrar
          </Link>
        </div>
      )}
    </header>
  );
}
