# ShopMetrics — Dashboard de E-commerce

Dashboard analítico completo para gestão de e-commerce, com CRUD, gráficos interativos e filtros por período.

![ShopMetrics Dashboard](https://img.shields.io/badge/status-active-success)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)

---

## ✨ Funcionalidades

- **Dashboard Principal** — KPIs em tempo real (receita, pedidos, ticket médio, clientes)
- **Filtro por Período** — DateRangePicker com atalhos (7 dias, 30 dias, 3 meses etc.)
- **Gráficos Interativos** — Receita mensal (área), status dos pedidos (donut), categorias (barras)
- **Alertas de Estoque** — Produtos com estoque baixo destacados automaticamente
- **Gestão de Pedidos** — Atualização de status inline sem abrir modais
- **CRUD de Produtos** — Criar, editar e remover com validação completa
- **CRUD de Clientes** — Gestão completa com filtro por estado (UF)
- **Responsivo** — Sidebar adaptável com menu hamburguer no mobile

---

## 🧱 Stack Tecnológica

| Camada | Tecnologia | Por quê |
|---|---|---|
| Framework | React 18 + Vite | Build ultrarrápido, HMR instantâneo |
| Linguagem | TypeScript | Tipagem estática, menos bugs |
| Estilização | TailwindCSS 3 | Utilitários CSS, sem arquivos .css |
| Componentes | Shadcn/ui + Radix | Acessível, customizável, sem lock-in |
| Banco de Dados | Supabase (PostgreSQL) | BaaS com API REST automática |
| Data Fetching | TanStack Query v5 | Cache, loading states, revalidação |
| Formulários | React Hook Form + Zod | Validação performática com schema |
| Gráficos | Recharts | Gráficos nativos para React |
| Datas | date-fns | Manipulação de datas leve e tipada |
| Roteamento | React Router v6 | Navegação declarativa com Layout Routes |

---

## 🗂️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                    # Componentes Shadcn (gerados automaticamente)
│   └── dashboard/             # Componentes específicos da aplicação
│       ├── CategoryChart.tsx  # Gráfico de barras por categoria
│       ├── DateRangePicker.tsx# Seletor de período com atalhos
│       ├── DashboardLayout.tsx# Layout base (sidebar + header + outlet)
│       ├── Header.tsx         # Header com notificações e perfil
│       ├── KpiCard.tsx        # Card de métrica com skeleton
│       ├── LowStockCard.tsx   # Alerta de estoque baixo
│       ├── OrdersStatusChart.tsx # Gráfico donut de status
│       ├── RevenueChart.tsx   # Gráfico de área de receita
│       ├── Sidebar.tsx        # Navegação lateral responsiva
│       ├── StatusBadge.tsx    # Badge de status reutilizável
│       └── TopProductsCard.tsx# Ranking de produtos
├── hooks/
│   ├── useCustomers.ts        # CRUD de clientes
│   ├── useDashboardMetrics.ts # Métricas do dashboard com filtro
│   ├── useOrders.ts           # Pedidos + update de status
│   └── useProducts.ts         # CRUD de produtos
├── lib/
│   ├── supabase.ts            # Cliente Supabase configurado
│   └── utils.ts               # Utilitário cn() do Shadcn
├── pages/
│   ├── Customers/
│   │   ├── CustomerFormModal.tsx
│   │   ├── CustomersPage.tsx
│   │   └── customerSchema.ts  # Validação Zod
│   ├── Dashboard/
│   │   └── DashboardPage.tsx
│   ├── Orders/
│   │   └── OrdersPage.tsx
│   └── Products/
│       ├── ProductFormModal.tsx
│       ├── ProductsPage.tsx
│       └── productSchema.ts   # Validação Zod
├── types/
│   └── database.ts            # Interfaces TypeScript das tabelas
├── App.tsx                    # Roteamento principal
└── main.tsx                   # Entry point + providers globais
```

---

## 🗄️ Modelo de Dados

```
customers (clientes)
    │
    └──< orders (pedidos)
              │
              └──< order_items (itens do pedido)
                        │
                        └──> products (produtos)
```

### Tabelas

**customers** — `id`, `name`, `email`, `phone`, `city`, `state`, `created_at`

**products** — `id`, `name`, `category`, `price`, `stock`, `created_at`

**orders** — `id`, `customer_id (FK)`, `status`, `total`, `created_at`

**order_items** — `id`, `order_id (FK)`, `product_id (FK)`, `quantity`, `unit_price`

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js v18+
- Conta no [Supabase](https://supabase.com) (gratuito)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ecommerce-dashboard.git
cd ecommerce-dashboard
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

> As credenciais estão em **Supabase → Settings → API**

### 4. Configure o banco de dados

No **SQL Editor** do Supabase, execute os scripts na ordem:

1. `database/01_schema.sql` — Criação das tabelas
2. `database/02_seed.sql` — Dados fictícios para teste
3. `database/03_disable_rls.sql` — Desativa RLS para desenvolvimento

### 5. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## 📜 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento com HMR
npm run build    # Build de produção (pasta /dist)
npm run preview  # Preview do build de produção localmente
npm run lint     # Verifica o código com ESLint
```

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|---|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Chave pública anon do Supabase | ✅ |

> **Importante:** Nunca commite o arquivo `.env` no Git. Ele já está no `.gitignore`.

---

## 🌐 Deploy

O projeto está hospedado na **Vercel** com deploy automático a cada push na branch `main`.

Para fazer seu próprio deploy, veja o [Guia de Deploy](#) ou siga os passos:

1. Suba o código para um repositório GitHub
2. Importe o projeto na [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
4. Deploy automático! ✅

---

## 📄 Licença

MIT.