import { useEffect, useState, type FormEvent } from 'react';
import { UserRound } from 'lucide-react';
import { supabase } from '../../lib/superbase';

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error || !data.user) {
        setNotice(error?.message || "Entre novamente para editar seu perfil.");
      } else {
        setName(
          data.user.user_metadata?.name ||
            data.user.user_metadata?.full_name ||
            "",
        );
        setEmail(data.user.email || "");
        setAvatarUrl(data.user.user_metadata?.avatar_url || "");
      }
      setLoading(false);
    }
    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(avatarFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatarFile]);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) {
        throw new Error("Sua sessão expirou. Entre novamente para editar o perfil.");
      }
      let nextAvatarUrl = avatarUrl;
      if (avatarFile) {
        const extensions: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
        };
        const extension = extensions[avatarFile.type];
        if (!extension || avatarFile.size > 5 * 1024 * 1024) {
          throw new Error("Escolha uma imagem PNG, JPG ou WebP de até 5 MB.");
        }
        const path = `${authData.user.id}/${Date.now()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, {
            contentType: avatarFile.type,
            cacheControl: "3600",
          });
        if (uploadError) throw uploadError;
        nextAvatarUrl = supabase.storage.from("avatars").getPublicUrl(path)
          .data.publicUrl;
      }
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: name.trim(),
          full_name: name.trim(),
          avatar_url: nextAvatarUrl,
        },
      });
      if (error) throw error;
      const profile = {
        name: data.user.user_metadata?.name || name.trim(),
        email: data.user.email || email,
        avatar: data.user.user_metadata?.avatar_url || nextAvatarUrl,
      };
      localStorage.setItem("vi-user", JSON.stringify(profile));
      window.dispatchEvent(new Event("vi-user-updated"));
      setAvatarUrl(profile.avatar);
      setAvatarFile(null);
      setNotice("Perfil atualizado.");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Não foi possível atualizar o perfil.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Carregando seu perfil...</p>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <h2 className="text-xl font-extrabold">Meu perfil</h2>
      <p className="mt-1 text-sm text-slate-500">
        Atualize seu nome e a foto exibidos na sua conta.
      </p>
      <form onSubmit={saveProfile} className="mt-6 max-w-xl space-y-5">
        <div className="flex items-center gap-4">
          {previewUrl || avatarUrl ? (
            <img
              src={previewUrl || avatarUrl}
              alt="Foto do perfil"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <UserRound size={30} />
            </span>
          )}
          <label className="text-sm font-semibold">
            Foto do perfil
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) =>
                setAvatarFile(event.target.files?.[0] || null)
              }
              className="mt-2 block max-w-full text-sm font-normal text-slate-600"
            />
            <span className="mt-1 block text-xs font-normal text-slate-400">
              PNG, JPG ou WebP; até 5 MB
            </span>
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Nome
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
          />
        </label>
        <label className="block text-sm font-semibold">
          E-mail
          <input
            value={email}
            readOnly
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-500"
          />
        </label>
        <button
          disabled={saving}
          className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar perfil"}
        </button>
        {notice && (
          <p role="status" className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
            {notice}
          </p>
        )}
      </form>
    </div>
  );
}
