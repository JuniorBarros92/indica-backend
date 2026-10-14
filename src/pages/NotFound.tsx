import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Search size={28} />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold">
        Página não encontrada
      </h1>
      <p className="mt-2 text-slate-500">
        O endereço pode estar incorreto ou esse conteúdo não existe.
      </p>
      <Link
        to="/"
        className="mt-5 rounded-xl bg-brand-500 px-5 py-3 font-bold text-white"
      >
        Voltar para a vitrine
      </Link>
    </main>
  );
}
