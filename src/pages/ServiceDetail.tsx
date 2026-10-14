import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Clock3, Heart, MapPin, MessageCircle, Star } from 'lucide-react';
import type { Service } from '../types/service';
import { services } from '../lib/data';
import { getActiveServiceTable, mapDbService } from '../lib/services';
import { supabase } from '../lib/superbase';
import { formatCurrency } from '../utils/formatCurrency';
import Rating from '../components/ui/Rating';
import NotFound from './NotFound';

export default function ServiceDetail(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(() =>
    JSON.parse(localStorage.getItem('vi-favs') || '[]').includes(Number(id)),
  );

  useEffect(() => {
    let active = true;
    async function load() {
      const table = await getActiveServiceTable();
      const { data, error } = await supabase
        .from(table)
        .select('id,title,category,price,description,photo,user_id')
        .eq('id', Number(id))
        .maybeSingle();
      if (!active) return;
      if (!error && data) {
        const profile = JSON.parse(localStorage.getItem('vi-user') || '{}');
        setService(mapDbService(data, profile.name || 'Vizinho', profile.avatar || ''));
        setLoading(false);
        return;
      }
      const fallback = services.find((x) => x.id === Number(id));
      setService(fallback || null);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [id]);

  if (loading) return <main className="mx-auto max-w-7xl px-5 py-12 text-sm text-slate-500">Carregando anúncio...</main>;
  if (!service) return <NotFound/>;

  return (
    <main className="page-enter mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600">← Voltar para os serviços</Link>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="overflow-hidden rounded-3xl bg-slate-100">
            <img src={service.photo} alt={service.title} className="aspect-[16/9] w-full object-cover"/>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">{service.category}</span>
            <Rating value={service.rating} count={service.reviews}/>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{service.title}</h1>
          <p className="mt-5 text-base leading-8 text-slate-600">{service.description}</p>
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-extrabold">Sobre o atendimento</h2>
            <div className="mt-4 flex items-start gap-3">
              <MapPin className="mt-0.5 text-brand-600" size={19}/>
              <div>
                <p className="font-bold">{service.condo}</p>
                <p className="mt-1 text-sm text-slate-500">Atendimento na região do condomínio</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <Clock3 className="mt-0.5 text-brand-600" size={19}/>
              <div>
                <p className="font-bold">Combine o melhor horário</p>
                <p className="mt-1 text-sm text-slate-500">Consulte a disponibilidade diretamente com o profissional.</p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-extrabold">Avaliações dos vizinhos</h2>
            {service.reviews ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-rating">
                    <Star size={18} className="fill-rating"/>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold">{service.rating.toFixed(1)}</p>
                    <p className="text-sm text-slate-500">Baseado em {service.reviews} avaliações</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                Esse profissional ainda não recebeu avaliações da comunidade.
              </div>
            )}
          </div>
        </div>

        <aside className="lg:pl-4">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <img src={service.avatar} alt={service.name} className="h-12 w-12 rounded-full object-cover"/>
              <div>
                <p className="font-extrabold">{service.name}</p>
                <p className="text-sm text-slate-500">{service.condo}</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[.15em] text-slate-400">A partir de</p>
              <p className="mt-2 text-3xl font-extrabold text-brand-600">{formatCurrency(service.price)}</p>
            </div>
            <button
              onClick={() => {
                const conversation = `/dashboard/mensagens?servico=${encodeURIComponent(String(service.id))}&nome=${encodeURIComponent(service.name)}&anuncio=${encodeURIComponent(service.title)}&foto=${encodeURIComponent(service.avatar)}`;
                const destination = localStorage.getItem("vi-user")
                  ? conversation
                  : `/auth?redirect=${encodeURIComponent(conversation)}`;
                navigate(destination);
              }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3.5 font-bold text-white"
            >
              <MessageCircle size={18}/> Falar com {service.name.split(' ')[0]}
            </button>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3.5 font-bold text-slate-700">
              <Heart size={18} className={fav ? 'fill-rose-500 text-rose-500' : ''}/> {fav ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
            </button>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[.15em] text-slate-400">Sobre</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{service.bio}</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
