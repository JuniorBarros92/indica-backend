import type { FormEvent } from 'react';
import { BadgeCheck, CheckCircle2, Search, ShieldCheck, Star } from 'lucide-react';

type HeroProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
};

export default function Hero({
  query,
  onQueryChange,
  onSearch,
}: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-primary">
      <div className="absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full border-[60px] border-white/10" />
      <div className="absolute -bottom-36 left-[38%] -z-10 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:py-24">
        <div className="text-white">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-bold backdrop-blur">
            <ShieldCheck size={15} /> Indicações de quem mora perto
          </div>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[58px]">
            Encontre profissionais de confiança{' '}
            <span className="text-emerald-100">no seu condomínio.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Serviços recomendados por vizinhos, pertinho de você. Mais
            praticidade para sua rotina, mais confiança em cada escolha.
          </p>
          <form
            onSubmit={onSearch}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-emerald-950/20"
          >
            <Search className="ml-3 shrink-0 text-slate-400" size={21} />
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Ex.: eletricista, faxina, aulas..."
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink outline-none placeholder:text-slate-400 sm:text-base"
            />
            <button className="rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 sm:px-6">
              Buscar
            </button>
          </form>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Profissionais locais
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Avaliações reais
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Fácil de encontrar
            </span>
          </div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -inset-5 rounded-[2rem] bg-white/10 blur-xl" />
          <div className="relative rotate-2 overflow-hidden rounded-[2rem] border-8 border-white/20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=90"
              className="h-[390px] w-full object-cover"
              alt="Casa acolhedora em um condomínio"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-brand-600">
                  <BadgeCheck size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ink">
                    Indicado pelos seus vizinhos
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Confiança começa na comunidade
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {[12, 44, 47].map((avatarId) => (
                    <img
                      key={avatarId}
                      src={`https://i.pravatar.cc/80?img=${avatarId}`}
                      className="h-8 w-8 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -left-8 top-12 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-rating">
              <Star className="fill-rating" size={18} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-ink">Bem avaliados</p>
              <p className="text-[11px] text-slate-500">
                Por quem já contratou
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
