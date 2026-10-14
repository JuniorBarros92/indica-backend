import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, House, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/superbase';

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      setNoticeType("error");
      setNotice("Preencha todos os campos para continuar.");
      return;
    }
    setIsSubmitting(true);
    setNotice("");
    const normalizedEmail = email.trim();
    let displayName = name.trim() || normalizedEmail.split("@")[0];
    let avatar = "";

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { name: displayName, full_name: displayName } },
        });
        if (error) throw error;

        if (!data.session) {
          setNoticeType("success");
          setNotice("Cadastro criado. Verifique seu e-mail para confirmar a conta antes de entrar.");
          return;
        }
        avatar = data.user?.user_metadata?.avatar_url || "";
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
        displayName =
          data.user.user_metadata?.name ||
          data.user.user_metadata?.full_name ||
          displayName;
        avatar = data.user.user_metadata?.avatar_url || "";
      }

      localStorage.setItem(
        "vi-user",
        JSON.stringify({ name: displayName, email: normalizedEmail, avatar }),
      );
      const redirect = searchParams.get("redirect");
      nav(redirect?.startsWith("/dashboard/") ? redirect : "/dashboard");
    } catch (error) {
      setNoticeType("error");
      setNotice(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a autenticação. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <main className="page-enter flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-primary p-10 text-white md:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <Link
            to="/"
            className="relative flex items-center gap-3 text-lg font-extrabold"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
              <House />
            </span>
            Vizinho Indica
          </Link>
          <div className="relative">
            <h1 className="text-4xl font-extrabold leading-tight">
              Boas conexões começam na vizinhança.
            </h1>
            <p className="mt-4 leading-7 text-white/85">
              Entre para encontrar profissionais indicados por quem mora perto
              de você.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4">
              <ShieldCheck size={24} />
              <p className="text-sm font-semibold">
                Mais confiança para contratar. Mais oportunidades para oferecer.
              </p>
            </div>
          </div>
          <p className="relative text-xs text-white/70">
            Sua comunidade, mais próxima.
          </p>
        </div>
        <div className="p-6 sm:p-10">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-500 hover:text-brand-600"
          >
            ← Voltar à vitrine
          </Link>
          <div className="mt-8">
            <h2 className="text-2xl font-extrabold">
              {mode === "login"
                ? "Que bom ter você de volta!"
                : "Crie sua conta"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === "login"
                ? "Entre para acessar seus serviços e favoritos."
                : "Comece a fazer parte da comunidade."}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => {
                setMode("login");
                setNotice("");
              }}
              className={`rounded-lg py-2.5 text-sm font-bold ${mode === "login" ? "bg-white text-ink shadow-sm" : "text-slate-500"}`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setNotice("");
              }}
              className={`rounded-lg py-2.5 text-sm font-bold ${mode === "signup" ? "bg-white text-ink shadow-sm" : "text-slate-500"}`}
            >
              Criar conta
            </button>
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <label className="block text-sm font-semibold">
                Nome completo
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                  placeholder="Como podemos te chamar?"
                />
              </label>
            )}
            <label className="block text-sm font-semibold">
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                placeholder="voce@email.com"
              />
            </label>
            <label className="block text-sm font-semibold">
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
                placeholder="Mínimo de 6 caracteres"
              />
            </label>
            <button disabled={isSubmitting} className="w-full rounded-xl bg-gradient-primary py-3.5 font-extrabold text-white shadow-elegant disabled:cursor-wait disabled:opacity-60">
              {isSubmitting ? "Aguarde..." : mode === "login" ? "Entrar na minha conta" : "Criar minha conta"}{" "}
              <ArrowRight size={17} className="ml-1 inline" />
            </button>
            {notice && (
              <p className={`rounded-xl p-3 text-sm font-semibold ${noticeType === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                {notice}
              </p>
            )}
          </form>
          <p className="mt-5 text-center text-xs leading-5 text-slate-400">
            Seus dados de acesso são protegidos pelo Supabase.
          </p>
        </div>
      </div>
    </main>
  );
}
