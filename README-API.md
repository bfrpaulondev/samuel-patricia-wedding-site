# Wedding Confirmation API

Sistema completo de gerenciamento de confirmações de casamento com stack MERN (MongoDB, Express, React, Node.js).

## 🚀 Funcionalidades

### Frontend (React + TypeScript + Material-UI)
- ✅ Formulário de confirmação de presença
- ✅ Design responsivo e elegante
- ✅ Integração com API segura
- ✅ Contagem regressiva para o casamento
- ✅ Mapas e informações dos eventos
- ✅ Animações e confetes

### Backend (Node.js + Express + MongoDB)
- ✅ API RESTful completa e documentada
- ✅ Autenticação JWT para administradores
- ✅ Rate limiting e proteção contra abuso
- ✅ Validação robusta de dados
- ✅ Documentação Swagger/OpenAPI
- ✅ Suporte a MongoDB Atlas

### Painel Administrativo
- ✅ Login seguro para noivos
- ✅ Visualização de todas as confirmações
- ✅ Aprovar/Rejeitar confirmações
- ✅ Estatísticas em tempo real
- ✅ Filtragem por status
- ✅ Gerenciamento completo de convidados

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou MongoDB Atlas)
- npm ou yarn

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

**IMPORTANTE:** Edite o arquivo `.env` e configure:
- `MONGODB_URI`: Sua connection string do MongoDB
- `JWT_SECRET`: Uma chave secreta forte
- `CORS_ORIGIN`: Domínios permitidos

### 3. Criar administrador inicial

```bash
npm run setup-admin
```

Isso criará o primeiro usuário administrador com as credenciais definidas no `.env`:
- Username: `samuel` (padrão)
- Senha: `NoivosSamuelPatricia2026!` (padrão)

**⚠️ IMPORTANTE: Mude a senha após o primeiro login!**

## 🛠️ Desenvolvimento

### Executar frontend
```bash
npm run dev
```

### Executar backend
```bash
npm run dev:api
```

### Executar ambos simultaneamente
```bash
npm run dev:all
```

## 📚 Documentação da API

Após iniciar o backend, acesse:
- Swagger UI: `http://localhost:5000/api-docs`
- Health Check: `http://localhost:5000/health`

## 🔐 Endpoints da API

### Público
- `POST /api/confirmations` - Criar confirmação
- `GET /api/confirmations/check/:email` - Verificar confirmação por email

### Admin (Requer autenticação)
- `POST /api/admin/login` - Login de administrador
- `GET /api/admin/confirmations` - Listar confirmações
- `PATCH /api/admin/confirmations/:id/approve` - Aprovar confirmação
- `PATCH /api/admin/confirmations/:id/reject` - Rejeitar confirmação
- `DELETE /api/admin/confirmations/:id` - Deletar confirmação
- `GET /api/admin/stats` - Obter estatísticas

## 🚀 Deploy na Vercel

### 1. Preparar MongoDB
Configure um cluster MongoDB Atlas:
1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Copie a connection string

### 2. Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. Configurar Variáveis de Ambiente na Vercel
No dashboard da Vercel, adicione:
- `MONGODB_URI`: Sua connection string do MongoDB Atlas
- `JWT_SECRET`: Chave secreta forte (gere com: `openssl rand -base64 32`)
- `CORS_ORIGIN`: Domínio do seu site (ex: `https://seu-site.vercel.app`)
- `NODE_ENV`: `production`

### 4. Acessar
- Frontend: `https://seu-projeto.vercel.app`
- Admin: `https://seu-projeto.vercel.app/admin/login`
- API: `https://seu-projeto.vercel.app/api`
- API Docs: `https://seu-projeto.vercel.app/api-docs`

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Rate limiting
- ✅ Validação de dados
- ✅ Proteção contra ataques comuns
- ✅ CORS configurável
- ✅ Helmet.js para headers de segurança
- ✅ Senhas hashadas com bcrypt

## 📊 Estrutura do Projeto

```
wedding-pwa/
├── api/                    # Backend API
│   ├── config/            # Configurações
│   ├── models/            # Models Mongoose
│   ├── routes/            # Rotas da API
│   ├── middleware/        # Middlewares
│   ├── utils/             # Utilitários
│   └── index.ts           # Servidor principal
├── src/                   # Frontend React
│   ├── pages/             # Páginas
│   ├── components/        # Componentes
│   ├── services/          # Serviços (API)
│   ├── contexts/          # Context API
│   └── ...
├── .env                   # Variáveis de ambiente
├── .env.example           # Exemplo de variáveis
├── vercel.json            # Configuração Vercel
└── package.json           # Dependências
```

## 👥 Acesso ao Painel Admin

1. Acesse: `/admin/login`
2. Use as credenciais criadas com `npm run setup-admin`
3. Após login, você terá acesso ao dashboard completo

## 🎨 Personalização

### Cores e Tema
Edite `src/theme.ts` para personalizar as cores.

### Data do Casamento
Edite `WEDDING_DATE` em `src/App.tsx`:
```typescript
const WEDDING_DATE = new Date("2026-05-17T00:00:00");
```

### Informações dos Eventos
Edite os endereços e informações em `src/App.tsx`.

## 📝 Licença

Este projeto foi desenvolvido para o casamento de Samuel & Patrícia.

---

**Desenvolvido com ❤️ para Samuel & Patrícia**

🎊 17 de Maio de 2026 🎊
