# Vizinho Indica — Front-end

Front-end demonstrativo do marketplace de serviços locais, feito com React + TypeScript + Vite + Tailwind CSS + React Router + Lucide React.

## Rodar localmente

```bash
npm install
npm run dev
```

Para validar a compilação:

```bash
npm run build
```

## Organização do código

- `src/pages/` contém as páginas associadas às rotas; as telas do painel ficam em `src/pages/dashboard/`.
- `src/components/layout/` reúne o cabeçalho, o rodapé e a estrutura do painel.
- `src/components/sections/` contém as seções da página inicial, como o destaque e a vitrine de serviços.
- `src/components/ui/` contém elementos visuais reutilizados, como o card de serviço e a avaliação.
- `src/lib/` reúne os dados de exemplo e as funções de acesso a serviços no Supabase.
- `src/types/` guarda tipos compartilhados; `src/utils/` reúne funções auxiliares, como a formatação de moeda.

Para adicionar uma seção à página inicial, crie um componente em `src/components/sections/` e importe-o em `src/pages/Home.tsx`. Se a seção precisar de dados ou eventos, receba-os por propriedades tipadas e mantenha a lógica de estado na página quando ela for compartilhada com outras seções.

## Telas incluídas

- `/` — vitrine com busca, ordenação, cards, favoritos e layout responsivo.
- `/servico/:id` — detalhes, preço, perfil do profissional, avaliações e ações de contato/favorito.
- `/auth` — login e cadastro de usuários.
- `/dashboard` — criação e exclusão de anúncios.
- `/dashboard/perfil` — edição dos dados e da foto do perfil.
- `/dashboard/favoritos` — serviços salvos.
- `/dashboard/mensagens` — conversas sobre anúncios.

## Importante

Autenticação, anúncios, perfis e conversas usam Supabase; configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em `.env.local`. Os serviços de exemplo e os favoritos usam dados locais. Antes de usar em produção, revise as políticas de acesso e a configuração do projeto Supabase.
