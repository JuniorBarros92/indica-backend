import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { services } from '../lib/data';
import { getActiveServiceTable, mapDbService } from '../lib/services';
import { supabase } from '../lib/superbase';
import type { Service } from '../types/service';
import Hero from '../components/sections/Hero';
import ServiceCatalogue from '../components/sections/ServiceCatalogue';

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState('Todos');
  const [favorites, setFavorites] = useState<number[]>(() =>
    JSON.parse(localStorage.getItem('vi-favs') || '[]'),
  );
  const [sort, setSort] = useState('rating');
  const [publicServices, setPublicServices] = useState<Service[]>(services);

  useEffect(() => {
    let active = true;

    async function loadServices() {
      const table = await getActiveServiceTable();
      const { data, error } = await supabase
        .from(table)
        .select('id,title,category,price,description,photo,user_id,created_at')
        .order('created_at', { ascending: false });

      if (!active) return;
      if (!error && Array.isArray(data) && data.length) {
        const profile = JSON.parse(localStorage.getItem('vi-user') || '{}');
        const mapped = data.map((row) =>
          mapDbService(row, profile.name || 'Vizinho', profile.avatar || ''),
        );
        setPublicServices([...mapped, ...services]);
        return;
      }

      setPublicServices(services);
    }

    void loadServices();
    return () => {
      active = false;
    };
  }, []);

  function toggleFavorite(id: number) {
    setFavorites((currentFavorites) => {
      const nextFavorites = currentFavorites.includes(id)
        ? currentFavorites.filter((favoriteId) => favoriteId !== id)
        : [...currentFavorites, id];
      localStorage.setItem('vi-favs', JSON.stringify(nextFavorites));
      return nextFavorites;
    });
  }

  const shownServices = useMemo(
    () =>
      publicServices
        .filter(
          (service) =>
            (category === 'Todos' || service.category === category) &&
            `${service.title} ${service.category} ${service.name} ${service.condo}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((first, second) =>
          sort === 'price'
            ? first.price - second.price
            : sort === 'new'
              ? second.id - first.id
              : second.rating - first.rating,
        ),
    [category, query, sort, publicServices],
  );

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setParams(query ? { q: query } : {});
  }

  function clearFilters() {
    setQuery('');
    setCategory('Todos');
    setParams({});
  }

  return (
    <main className="page-enter">
      <Hero query={query} onQueryChange={setQuery} onSearch={search} />
      <ServiceCatalogue
        services={shownServices}
        favorites={favorites}
        sort={sort}
        onSortChange={setSort}
        onFavorite={toggleFavorite}
        onClearFilters={clearFilters}
      />
    </main>
  );
}
