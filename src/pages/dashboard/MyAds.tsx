import { useEffect, useState, type FormEvent } from 'react';
import { LayoutDashboard, Plus, Trash2 } from 'lucide-react';
import { categories } from '../../lib/data';
import type { Service } from '../../types/service';
import { getActiveServiceTable } from '../../lib/services';
import { supabase } from '../../lib/superbase';
import { formatCurrency } from '../../utils/formatCurrency';

export default function MyAds() {
  const [mine, setMine] = useState<Service[]>([]);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Reformas");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function loadAds() {
      setLoading(true);
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) {
        if (active) {
          setNotice(authError?.message || "Entre novamente para ver seus anúncios.");
          setLoading(false);
        }
        return;
      }
      const table = await getActiveServiceTable();
      const { data, error } = await supabase
        .from(table)
        .select("id,title,category,price,description,photo")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        setNotice(error.message);
      } else {
        const profile = JSON.parse(localStorage.getItem("vi-user") || "{}");
        setMine(
          (data || []).map((row) => ({
            ...row,
            price: Number(row.price),
            rating: 0,
            reviews: 0,
            name: profile.name || authData.user.user_metadata?.name || "Vizinho",
            avatar: profile.avatar || authData.user.user_metadata?.avatar_url || "",
            condo: "Meu condomínio",
            bio: "Profissional da comunidade.",
            whatsapp: "",
          })),
        );
      }
      setLoading(false);
    }
    void loadAds();
    return () => {
      active = false;
    };
  }, []);

  async function add(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error("Sua sessão expirou. Entre novamente para publicar.");
      }
      const table = await getActiveServiceTable();
      const { data, error } = await supabase
        .from(table)
        .insert({
          user_id: authData.user.id,
          title: title.trim(),
          category,
          price: Number(price),
          description: description.trim(),
        })
        .select("id,title,category,price,description,photo")
        .single();
      if (error) throw error;
      const profile = JSON.parse(localStorage.getItem("vi-user") || "{}");
      setMine((current) => [
        {
          ...data,
          price: Number(data.price),
          rating: 0,
          reviews: 0,
          name: profile.name || authData.user.user_metadata?.name || "Vizinho",
          avatar: profile.avatar || authData.user.user_metadata?.avatar_url || "",
          condo: "Meu condomínio",
          bio: "Profissional da comunidade.",
          whatsapp: "",
        },
        ...current,
      ]);
      setShow(false);
      setTitle("");
      setPrice("");
      setDescription("");
      setNotice("Anúncio publicado e salvo na sua conta.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Não foi possível salvar o anúncio.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    setDeletingId(id);
    setNotice("");
    const table = await getActiveServiceTable();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      setNotice(error.message);
    } else {
      setMine((current) => current.filter((item) => item.id !== id));
      setNotice("Anúncio removido.");
    }
    setDeletingId(null);
  }
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold">Meus anúncios</h2>
          <p className="mt-1 text-sm text-slate-500">
            Seus serviços publicados na comunidade.
          </p>
        </div>
        <button
          onClick={() => setShow(!show)}
          className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white"
        >
          <Plus className="mr-1 inline" size={17} /> Novo anúncio
        </button>
      </div>
      {notice && (
        <p role="status" className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
          {notice}
        </p>
      )}
      {show && (
        <form
          onSubmit={add}
          className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2"
        >
          <label className="text-sm font-semibold">
            Título do serviço
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border bg-white p-3 font-normal"
              placeholder="Ex.: Manutenção residencial"
            />
          </label>
          <label className="text-sm font-semibold">
            Preço estimado (R$)
            <input
              required
              type="number"
              min="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1.5 w-full rounded-xl border bg-white p-3 font-normal"
              placeholder="80"
            />
          </label>
          <label className="text-sm font-semibold">
            Categoria
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border bg-white p-3 font-normal"
            >
              {categories
                .filter((c) => c !== "Todos")
                .map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            Descrição
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-xl border bg-white p-3 font-normal"
              rows={3}
              placeholder="Conte um pouco sobre seu serviço"
            />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button disabled={saving} className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">
              {saving ? "Salvando..." : "Publicar anúncio"}
            </button>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="rounded-xl border px-5 py-2.5 text-sm font-bold"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Carregando seus anúncios...</p>
      ) : mine.length ? (
        <div className="mt-5 space-y-3">
          {mine.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-4 rounded-xl border border-slate-100 p-3"
            >
              <img
                src={s.photo}
                className="h-16 w-20 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{s.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatCurrency(s.price)} · {s.category}
                </p>
              </div>
              <button
                onClick={() => void remove(s.id)}
                disabled={deletingId === s.id}
                className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <LayoutDashboard />
          </div>
          <h3 className="mt-3 font-bold">Você ainda não tem anúncios</h3>
          <p className="mt-1 text-sm text-slate-500">
            Publique seu primeiro serviço para aparecer na vitrine.
          </p>
          <button
            onClick={() => setShow(true)}
            className="mt-4 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white"
          >
            Criar primeiro anúncio
          </button>
        </div>
      )}
    </div>
  );
}
