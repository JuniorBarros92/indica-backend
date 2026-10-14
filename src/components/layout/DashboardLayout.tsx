import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, LayoutDashboard, LogIn, Menu, MessagesSquare, UserRound } from 'lucide-react';
import { supabase } from '../../lib/superbase';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("vi-user") || "null"),
  );
  const nav = useNavigate();
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const refreshUser = () =>
      setUser(JSON.parse(localStorage.getItem("vi-user") || "null"));
    window.addEventListener("vi-user-updated", refreshUser);
    return () => window.removeEventListener("vi-user-updated", refreshUser);
  }, []);
  const links = [
    { to: "/dashboard", label: "Meus anúncios", icon: LayoutDashboard },
    { to: "/dashboard/perfil", label: "Meu perfil", icon: UserRound },
    { to: "/dashboard/favoritos", label: "Favoritos", icon: Heart },
    { to: "/dashboard/mensagens", label: "Mensagens", icon: MessagesSquare },
  ];
  return (
    <main className="page-enter mx-auto min-h-[70vh] max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-600">
            Área do usuário
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
            Olá, {user?.name || "vizinho"}!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Gerencie seus serviços e acompanhe suas conversas.
          </p>
        </div>
        <button
          onClick={() => setMobile(!mobile)}
          className="rounded-xl border bg-white p-3 lg:hidden"
        >
          <Menu size={19} />
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside
          className={`${mobile ? "block" : "hidden"} h-fit rounded-2xl border border-slate-200 bg-white p-3 lg:block`}
        >
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <UserRound />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {user?.name || "Visitante"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || "Modo demonstração"}
              </p>
            </div>
          </div>
          {links.map((l) => (
            <Link
              key={l.to}
              onClick={() => setMobile(false)}
              to={l.to}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            >
              <l.icon size={18} />
              {l.label}
              <ChevronRight size={15} className="ml-auto" />
            </Link>
          ))}
          <button
            onClick={() => {
              void supabase.auth.signOut();
              localStorage.removeItem("vi-user");
              nav("/auth");
            }}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            <LogIn size={18} /> Sair
          </button>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
