import { ArrowRight, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Service } from '../../types/service';
import { formatCurrency } from '../../utils/formatCurrency';
import Rating from './Rating';

type ServiceCardProps = {
  s: Service;
  favorite: boolean;
  onFavorite: (id: number) => void;
};

export default function ServiceCard({
  s,
  favorite,
  onFavorite,
}: ServiceCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-elegant">
      <div className="relative overflow-hidden">
        <Link to={`/servico/${s.id}`}>
          <img
            src={s.photo}
            alt={s.title}
            className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-sm">
          {s.category}
        </span>
        <button
          aria-label="Favoritar"
          onClick={() => onFavorite(s.id)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 ${
            favorite ? 'text-rose-500' : 'text-slate-500'
          }`}
        >
          <Heart size={17} className={favorite ? 'fill-rose-500' : ''} />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <img
            src={s.avatar}
            alt={s.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
          />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-700">{s.name}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-slate-400">
              <MapPin size={11} />
              {s.condo}
            </p>
          </div>
          <span className="ml-auto">
            <Rating value={s.rating} count={s.reviews} />
          </span>
        </div>
        <Link
          to={`/servico/${s.id}`}
          className="line-clamp-2 min-h-[48px] text-[15px] font-bold leading-6 text-ink transition hover:text-brand-600"
        >
          {s.title}
        </Link>
        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              A partir de
            </span>
            <span className="text-lg font-extrabold text-brand-600">
              {formatCurrency(s.price)}
            </span>
          </div>
          <Link
            to={`/servico/${s.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition hover:bg-brand-500 hover:text-white"
          >
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}
