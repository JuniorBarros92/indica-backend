import { ArrowRight, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Service } from '../../types/service';
import ServiceCard from '../ui/ServiceCard';

type ServiceCatalogueProps = {
  services: Service[];
  favorites: number[];
  sort: string;
  onSortChange: (sort: string) => void;
  onFavorite: (id: number) => void;
  onClearFilters: () => void;
};

export default function ServiceCatalogue({
  services,
  favorites,
  sort,
  onSortChange,
  onFavorite,
  onClearFilters,
}: ServiceCatalogueProps) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-4 pt-8 sm:px-8 sm:pt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Profissionais perto de você
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {services.length}{' '}
              {services.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}{' '}
              para facilitar seu dia
            </p>
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
            <SlidersHorizontal size={15} />
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              className="bg-transparent font-semibold text-slate-700 outline-none"
            >
              <option value="rating">Melhor avaliados</option>
              <option value="price">Menor preço</option>
              <option value="new">Mais recentes</option>
            </select>
          </label>
        </div>
        {services.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                s={service}
                favorite={favorites.includes(service.id)}
                onFavorite={onFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Search size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold">
              Não encontramos esse serviço
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Tente outro termo ou escolha uma categoria diferente.
            </p>
            <button
              onClick={onClearFilters}
              className="mt-5 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
              Faça parte da comunidade
            </span>
            <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
              Você presta um bom serviço?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Divulgue seu trabalho para pessoas que moram perto e conquiste
              novos clientes.
            </p>
          </div>
          <Link
            to="/auth"
            className="shrink-0 rounded-xl bg-gradient-primary px-5 py-3 font-bold text-white shadow-elegant"
          >
            Anunciar serviço <ArrowRight className="ml-2 inline" size={17} />
          </Link>
        </div>
      </section>
      <Link
        to="/auth"
        aria-label="Anunciar serviço"
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-4 font-bold text-white shadow-xl shadow-emerald-900/20 transition hover:scale-105 sm:hidden"
      >
        <Plus size={20} /> Anunciar
      </Link>
    </>
  );
}
