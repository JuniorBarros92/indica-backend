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

## Telas incluídas

- `/` — vitrine com busca, filtros por categoria, ordenação, cards, favoritos e layout responsivo.
- `/servico/:id` — detalhes, preço, perfil do profissional, avaliações e ações de contato/favorito.
- `/auth` — interface de login e cadastro em modo demonstração.
- `/dashboard` — criar e excluir anúncios em armazenamento local.
- `/dashboard/favoritos` — serviços salvos.
- `/dashboard/mensagens` — interface de chat com envio de mensagens de demonstração.

## Importante

Este pacote é o front-end visual/funcional de demonstração. Login, avaliações reais, uploads, persistência compartilhada, segurança e chat em tempo real ainda precisam ser conectados ao backend Enter Cloud. Os dados iniciais e interações demonstrativas usam dados locais e `localStorage`; não use como sistema de produção sem integração e revisão de segurança.
