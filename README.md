# 🎉 Quatro Ventos — Espaço para Eventos

<div align="center">

**Plataforma premium de gerenciamento e agendamento para espaço de eventos**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748?logo=prisma)](https://prisma.io)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://docker.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql)](https://postgresql.org)

</div>

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Screenshots](#-screenshots)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação Local](#-instalação-local)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Deploy com Docker](#-deploy-com-docker)
- [Deploy na VPS](#-deploy-na-vps)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Reference](#-api-reference)
- [Banco de Dados](#-banco-de-dados)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🌟 Visão Geral

**Quatro Ventos** é uma plataforma web completa para gerenciamento de um espaço de eventos premium. O sistema oferece uma experiência de usuário sofisticada com design de luxo (navy + gold), sistema de agendamento inteligente com detecção de conflitos, painel administrativo completo, galeria de mídia, e notificações por email automáticas.

### Destaques

- 🎨 **Design Ultra-Premium** — Glassmorphism, gradientes cinemáticos, partículas animadas, e micro-interações
- 📅 **Agendamento Inteligente** — Verificação de conflitos em tempo real com slots de horário
- 📧 **Notificações por Email** — Emails HTML branded para confirmação e cancelamento de visitas
- 📸 **Galeria de Mídia** — Upload de imagens/vídeos com lightbox e filtros por categoria
- ⚙️ **Painel Admin** — Dashboard completo com gerenciamento de agendamentos, mídia e configurações do site
- 🔒 **Autenticação Segura** — NextAuth.js com credenciais e proteção de rotas por host
- 🐳 **Docker Ready** — Deploy completo com Docker Compose (app + PostgreSQL)
- 📱 **Responsivo** — Design adaptável para todos os dispositivos

---

## 🛠 Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| **Framework** | Next.js 16.1 (App Router, Turbopack) |
| **Linguagem** | TypeScript 5.8 |
| **Banco de Dados** | PostgreSQL 18 + Prisma ORM 6.5 |
| **Autenticação** | NextAuth.js 5 (beta) + bcryptjs |
| **Email** | Nodemailer + SMTP (Resend) |
| **Upload** | Sharp (processamento de imagens) |
| **Validação** | Zod |
| **Estilização** | CSS Modules + CSS Custom Properties |
| **Tipografia** | Playfair Display, Inter, Cormorant Garamond |
| **Deploy** | Docker + Nginx (reverse proxy) |

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      Cloudflare (CDN + SSL)                 │
├─────────────────────────────────────────────────────────────┤
│                      Nginx (Reverse Proxy)                  │
│        quatroventos.redecm.com.br → app:3000                │
│    adminquatroventos.redecm.com.br → app:3000               │
├─────────────────────────────────────────────────────────────┤
│                 Docker Compose Stack                        │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │  PostgreSQL 18   │  │  Next.js 16 (Standalone)         │ │
│  │  (quatroventos_  │──│  Port 3000 → Mapped 3100         │ │
│  │   db)            │  │  Prisma ORM                      │ │
│  └──────────────────┘  │  NextAuth.js                     │ │
│                        │  Nodemailer (SMTP)               │ │
│                        └──────────────────────────────────┘ │
│  Volumes: pgdata (DB) + uploads (media)                     │
└─────────────────────────────────────────────────────────────┘
```

### Separação de Hosts

| URL | Finalidade |
|-----|------------|
| `quatroventos.redecm.com.br` | Site público (home, espaços, galeria, agendamento, contato) |
| `adminquatroventos.redecm.com.br` | Painel administrativo (login obrigatório) |

---

## ✨ Funcionalidades

### 🌐 Site Público

- **Home Page** — Hero cinemático com partículas animadas, seção de eventos, estatísticas com contagem animada, seção "sobre" e CTA
- **Espaços** — Apresentação dos ambientes com capacidade, área, e descrições detalhadas
- **Galeria** — Grade masonry com filtros por categoria, lightbox para visualização completa
- **Agendamento** — Formulário inteligente com:
  - Verificação de disponibilidade em tempo real
  - Detecção de conflitos de horário (unique `slotKey`)
  - Validação com Zod
  - Email automático para o admin ao receber novo agendamento
- **Contato** — Formulário com envio de email direto para o admin, cards informativos com integração WhatsApp

### 🔐 Painel Administrativo

- **Dashboard** — Cards de estatísticas, tabela de agendamentos recentes, ações rápidas
- **Agendamentos** — Listagem com filtros por status (pendente, confirmado, cancelado), ações de confirmar/cancelar/excluir com email automático ao cliente
- **Mídia** — Upload de imagens e vídeos, categorização, gestão de galeria
- **Configurações** — Personalização completa do conteúdo de todas as páginas, dados de contato, redes sociais, horários, textos, e mais
- **Autenticação** — Login com credenciais, proteção por host (apenas `adminquatroventos.*` acessa o painel)

---

## 📦 Pré-requisitos

- **Node.js** >= 22.x
- **npm** >= 10.x
- **PostgreSQL** >= 16 (ou Docker)
- **Docker** e **Docker Compose** (para deploy)

---

## 🚀 Instalação Local

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/quatroventos.git
cd quatroventos
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas configurações de banco, SMTP, etc.
```

### 4. Inicialize o banco de dados

```bash
# Opção 1: Push do schema + seed
npm run bootstrap

# Opção 2: Manual
npx prisma db push
npx prisma generate
npm run db:seed
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:pass@localhost:5432/dbname` |
| `POSTGRES_DB` | Nome do banco de dados | `quatroventos_db` |
| `POSTGRES_USER` | Usuário do PostgreSQL | `quatroventos_user` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `sua_senha_segura` |
| `NEXTAUTH_SECRET` | Segredo para NextAuth.js | `string_aleatoria_longa` |
| `NEXTAUTH_URL` | URL do painel admin | `https://adminquatroventos.redecm.com.br` |
| `ADMIN_NAME` | Nome do admin (seed) | `Administrador` |
| `ADMIN_EMAIL` | Email do admin (seed) | `admin@quatroventos.com.br` |
| `ADMIN_PASSWORD` | Senha do admin (seed) | `SuaSenhaForte@2026!` |
| `APP_URL` | URL pública do site | `https://quatroventos.redecm.com.br` |
| `ADMIN_URL` | URL do painel admin | `https://adminquatroventos.redecm.com.br` |
| `NODE_ENV` | Ambiente | `production` |
| `SMTP_HOST` | Host SMTP | `smtp.resend.com` |
| `SMTP_PORT` | Porta SMTP | `465` |
| `SMTP_USER` | Usuário SMTP | `resend` |
| `SMTP_PASS` | Senha/chave SMTP | `re_xxx` |
| `SMTP_FROM` | Remetente de emails | `Quatro Ventos <no-reply@send.redecm.com.br>` |

---

## 🐳 Deploy com Docker

### Build e execução

```bash
# Iniciar todo o stack (app + banco de dados)
docker compose up -d --build

# Rodar migrations e seed (primeira vez)
docker compose --profile setup run --rm migrate
```

### Comandos úteis

```bash
# Logs da aplicação
docker compose logs -f app

# Restart da aplicação
docker compose restart app

# Rebuild após mudanças no código
docker compose up -d --build app

# Parar tudo
docker compose down

# Limpar volumes (⚠️ apaga dados do banco)
docker compose down -v
```

### Portas

| Serviço | Porta Interna | Porta Host |
|---------|-------------|-----------|
| App (Next.js) | 3000 | 3100 |
| PostgreSQL | 5432 | — (sem exposição) |

---

## 🌐 Deploy na VPS

### 1. Conecte à VPS

```bash
ssh -i ~/.ssh/chave_privada usuario@ip_da_vps
```

### 2. Clone e configure

```bash
cd /opt
git clone https://github.com/seu-usuario/quatroventos.git
cd quatroventos
cp .env.example .env
nano .env  # Preencha as variáveis
```

### 3. Execute com Docker

```bash
docker compose up -d --build
docker compose --profile setup run --rm migrate
```

### 4. Configure Nginx (reverse proxy)

Os arquivos de configuração Nginx estão em `/nginx`:

- `nginx.conf` — Configuração principal
- `quatroventos.conf` — Virtual host para os domínios
- `host-reverse-proxy.conf` — Configuração do host principal

### 5. Healthcheck

A aplicação possui healthcheck integrado que verifica `/api/settings`.

---

## 📁 Estrutura do Projeto

```
quatroventos/
├── prisma/
│   ├── schema.prisma         # Modelos do banco de dados
│   └── seed.ts               # Seed do admin e dados iniciais
├── public/                    # Assets estáticos (favicons, PWA icons)
├── src/
│   ├── app/
│   │   ├── globals.css        # Design system global
│   │   ├── layout.tsx         # Root layout com metadata SEO
│   │   ├── page.tsx           # Home page
│   │   ├── agendar/           # Página de agendamento
│   │   ├── contato/           # Página de contato
│   │   ├── espacos/           # Página de espaços
│   │   ├── galeria/           # Página de galeria
│   │   ├── admin/
│   │   │   ├── login/         # Login do admin
│   │   │   └── (panel)/       # Painel protegido por auth
│   │   │       ├── page.tsx            # Dashboard
│   │   │       ├── agendamentos/       # Gestão de agendamentos
│   │   │       ├── midia/              # Upload de mídia
│   │   │       └── configuracoes/      # Configurações do site
│   │   ├── api/
│   │   │   ├── appointments/  # CRUD de agendamentos + availability
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── contact/       # Formulário de contato
│   │   │   ├── media/         # Upload/listagem de mídia
│   │   │   └── settings/      # Configurações do site
│   │   └── media/[id]/        # Serve arquivos de mídia
│   ├── components/
│   │   ├── Navbar.tsx         # Navegação principal
│   │   ├── Footer.tsx         # Rodapé
│   │   ├── ConditionalLayout.tsx  # Layout condicional (público vs admin)
│   │   ├── SiteSettingsProvider.tsx  # Context de configurações
│   │   └── admin/             # Componentes do painel admin
│   ├── hooks/
│   │   └── useAnimations.ts   # Hooks de animação (scroll, countUp)
│   └── lib/
│       ├── appointments.ts    # Lógica de agendamentos
│       ├── auth.ts            # Configuração NextAuth
│       ├── content-icons.ts   # Ícones de conteúdo
│       ├── email.ts           # Envio de emails via SMTP
│       ├── media-storage.ts   # Armazenamento de mídia
│       ├── prisma.ts          # Cliente Prisma
│       ├── request-security.ts # Verificação de requisições
│       ├── site-host.ts       # Resolução de hosts
│       └── site-settings.ts   # Schema de configurações do site
├── nginx/                     # Configurações Nginx
├── storage/                   # Diretório de uploads de mídia
├── docker-compose.yml         # Stack Docker completo
├── Dockerfile                 # Multi-stage build (deps → build → runner)
└── Dockerfile.migrate         # Container de migração e seed
```

---

## 📡 API Reference

### Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/settings` | Retorna configurações do site |
| `GET` | `/api/media` | Lista todas as mídias |
| `GET` | `/api/appointments/availability?date=YYYY-MM-DD` | Verifica disponibilidade de horários |
| `POST` | `/api/appointments` | Cria novo agendamento |
| `POST` | `/api/contact` | Envia mensagem de contato por email |
| `GET` | `/media/[id]` | Serve arquivo de mídia |

### Autenticadas (Admin)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/appointments?status=&page=&limit=` | Lista agendamentos com paginação |
| `PATCH` | `/api/appointments` | Atualiza status (confirmar/cancelar) |
| `DELETE` | `/api/appointments?id=` | Exclui agendamento |
| `POST` | `/api/media` | Upload de mídia (multipart/form-data) |
| `DELETE` | `/api/media?id=` | Exclui mídia |
| `PUT` | `/api/settings` | Atualiza configurações do site |

---

## 🗃 Banco de Dados

### Modelos Prisma

```prisma
model Admin         # Administradores do sistema
model Appointment   # Agendamentos de visitas
model Media         # Arquivos de mídia (imagens/vídeos)
model Settings      # Configurações do site (JSON fields)
```

### Detalhes dos Modelos

**Appointment** — Possui `slotKey` único para prevenção de conflitos de horário.

**Settings** — Armazena todo o conteúdo personalizável do site em campos JSON (`homeContent`, `spacesContent`, `galleryContent`, `bookingContent`, `contactContent`, `footerContent`).

**Media** — Arquivos são armazenados em `/storage/media` e servidos via rota dinâmica `/media/[id]`.

---

## 📜 Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | Lint com ESLint |
| `npm run db:generate` | Gera cliente Prisma |
| `npm run db:migrate` | Roda migrações |
| `npm run db:push` | Push do schema para o banco |
| `npm run db:seed` | Seed do banco com dados iniciais |
| `npm run bootstrap` | Setup completo (push + generate + seed) |

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e de uso exclusivo do Quatro Ventos — Espaço para Eventos.

---

<div align="center">

**Feito com ❤️ para o Quatro Ventos**

*Espaço para Eventos — Celebrando momentos especiais*

</div>
