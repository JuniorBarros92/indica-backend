import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../../lib/data';
import { formatCurrency } from '../../utils/formatCurrency';

export default function Favorites() {
  const [favorites, setFavorites] = useState<number[]>(() =>
    JSON.parse(localStorage.getItem('vi-favs') || '[]'),
  );
  const favoriteServices = services.filter((service) =>
    favorites.includes(service.id),
  );

  function removeFavorite(id: number) {
    const nextFavorites = favorites.filter((favoriteId) => favoriteId !== id);
    setFavorites(nextFavorites);
    localStorage.setItem('vi-favs', JSON.stringify(nextFavorites));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <h2 className="text-xl font-extrabold">Meus favoritos</h2>
      <p className="mt-1 text-sm text-slate-500">
        Serviços que você salvou para consultar depois.
      </p>
      {favoriteServices.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {favoriteServices.map((service) => (
            <div
              key={service.id}
              className="flex gap-3 rounded-xl border border-slate-100 p-3"
            >
              <Link to={`/servico/${service.id}`}>
                <img
                  src={service.photo}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/servico/${service.id}`}
                  className="line-clamp-2 text-sm font-bold hover:text-brand-600"
                >
                  {service.title}
                </Link>
                <p className="mt-2 font-extrabold text-brand-600">
                  {formatCurrency(service.price)}
                </p>
                <button
                  onClick={() => removeFavorite(service.id)}
                  className="mt-2 text-xs font-bold text-rose-500"
                >
                  Remover favorito
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <Heart className="mx-auto text-slate-300" size={34} />
          <h3 className="mt-3 font-bold">Sua lista está vazia</h3>
          <p className="mt-1 text-sm text-slate-500">
            Explore a vitrine e salve os serviços de que gostar.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white"
          >
            Explorar serviços
          </Link>
        </div>
      )}
    </div>
  );
}
