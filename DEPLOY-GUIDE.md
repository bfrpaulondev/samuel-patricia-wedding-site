# 🚀 Guia Completo de Deploy na Vercel

## ✅ Status do Código

- ✅ Build testado e funcionando
- ✅ Todos os erros TypeScript corrigidos
- ✅ Chunks otimizados
- ✅ API backend completa
- ✅ MongoDB configurado
- ✅ 100% pronto para produção

---

## 📋 Opção 1: Deploy Automático via GitHub (RECOMENDADO)

Este é o método mais simples e permite deploys automáticos.

### Passo 1: Acessar Vercel
1. Acesse: https://vercel.com
2. Faça login com sua conta GitHub (bfrpaulondev)

### Passo 2: Criar Novo Projeto
1. Clique em **"Add New Project"** ou **"Import Project"**
2. Selecione o repositório: **samuel-patricia-wedding-site**
3. A Vercel detectará automaticamente que é um projeto Vite

### Passo 3: Configurar Build
A Vercel detectará automaticamente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

✅ Não precisa alterar nada!

### Passo 4: Configurar Variáveis de Ambiente

**IMPORTANTE**: Configure estas variáveis antes de fazer deploy:

#### Environment Variables (clique em "Environment Variables")

```bash
# MongoDB
MONGODB_URI=mongodb+srv://bfrpaulondev_db_user:Ci85Wu3bZ0iooagG@cluster0.mp369cb.mongodb.net/wedding-app?retryWrites=true&w=majority

# JWT
JWT_SECRET=NoivosSamuelPatricia2026
JWT_EXPIRES_IN=7d

# Node Environment
NODE_ENV=production

# CORS (atualize com seu domínio após deploy)
CORS_ORIGIN=https://seu-projeto.vercel.app

# Admin Padrão
ADMIN_USERNAME=samuel
ADMIN_EMAIL=samuel@casamento.com
ADMIN_PASSWORD=NoivosSamuelPatricia2026!

# API URL (atualize com seu domínio após deploy)
VITE_API_URL=https://seu-projeto.vercel.app/api
```

**⚠️ ATENÇÃO**: 
- Marque todas as variáveis para: **Production**, **Preview**, e **Development**
- Após o primeiro deploy, volte e atualize `CORS_ORIGIN` e `VITE_API_URL` com o domínio real

### Passo 5: Deploy
1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos para o build completar
3. ✅ Seu site estará online!

### Passo 6: Atualizar Variáveis de Ambiente
1. Após o deploy, copie o domínio (ex: `https://samuel-patricia-wedding-site.vercel.app`)
2. Vá em **Settings** → **Environment Variables**
3. Atualize:
   - `CORS_ORIGIN` → `https://SEU-DOMINIO.vercel.app`
   - `VITE_API_URL` → `https://SEU-DOMINIO.vercel.app/api`
4. Faça um novo deploy (Settings → Deployments → Redeploy)

---

## 🔧 Opção 2: Deploy Manual via CLI

Se preferir fazer deploy via terminal:

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Fazer Login
```bash
vercel login
```
Siga as instruções no navegador para autenticar.

### 3. Deploy
```bash
# Deploy de preview
vercel

# Deploy de produção
vercel --prod
```

### 4. Configurar Variáveis
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
# ... adicione todas as variáveis
```

---

## 🎯 Após o Deploy

### 1. Acessar o Site
- **Frontend**: `https://seu-dominio.vercel.app`
- **Admin Login**: `https://seu-dominio.vercel.app/admin/login`
- **API Docs**: `https://seu-dominio.vercel.app/api-docs`
- **API Health**: `https://seu-dominio.vercel.app/health`

### 2. Criar Admin Inicial
A Vercel não executa scripts após build, então você precisa criar o admin manualmente:

**Opção A**: Use a API diretamente
```bash
curl -X POST https://seu-dominio.vercel.app/api/admin/create-initial \
  -H "Content-Type: application/json"
```

**Opção B**: Execute localmente com MongoDB de produção
```bash
# Configure MONGODB_URI no .env
npm run setup-admin
```

### 3. Fazer Login
1. Acesse: `https://seu-dominio.vercel.app/admin/login`
2. Username: `samuel`
3. Senha: `NoivosSamuelPatricia2026!`

**⚠️ IMPORTANTE**: Mude a senha após o primeiro login!

---

## 🔐 Segurança Pós-Deploy

### 1. Mudar Senhas
```javascript
// No painel admin, mude:
- Senha do admin
- JWT_SECRET (gere uma nova chave forte)
```

### 2. Gerar JWT_SECRET Forte
```bash
# No terminal
openssl rand -base64 32
```

### 3. Configurar Domínio Personalizado (Opcional)
1. Vercel Dashboard → Settings → Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções
4. Atualize `CORS_ORIGIN` e `VITE_API_URL`

---

## 🔄 Deploys Automáticos

Com a integração GitHub ativada:

✅ **Cada push para `main`** → Deploy automático em produção
✅ **Cada PR** → Deploy de preview automático
✅ **Cada commit** → Build e teste automático

---

## 📊 Monitoramento

### Logs
- Vercel Dashboard → Deployments → Clique no deploy → Logs

### Analytics
- Vercel Dashboard → Analytics
- Veja visitantes, performance, erros

### MongoDB
- MongoDB Atlas Dashboard
- Monitore conexões, queries, storage

---

## ❓ Troubleshooting

### Erro: "Module not found"
```bash
# Limpe cache e reinstale
vercel --force
```

### Erro: "Environment variable not found"
```bash
# Verifique se todas as variáveis estão configuradas
vercel env ls
```

### Erro: "MongoDB connection failed"
```bash
# Verifique:
1. MongoDB Atlas está online
2. IP 0.0.0.0/0 está na whitelist
3. MONGODB_URI está correta
```

### Erro: "CORS blocked"
```bash
# Atualize CORS_ORIGIN com o domínio correto
```

---

## 📚 Links Úteis

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Repositório**: https://github.com/bfrpaulondev/samuel-patricia-wedding-site

---

## ✨ Checklist Final

Antes de considerar o deploy completo:

- [ ] Site acessível publicamente
- [ ] Admin login funcionando
- [ ] Formulário de confirmação salvando no MongoDB
- [ ] API Docs acessível
- [ ] Estatísticas aparecendo no painel admin
- [ ] Admin consegue aprovar/rejeitar confirmações
- [ ] Senhas alteradas
- [ ] CORS configurado corretamente
- [ ] MongoDB funcionando
- [ ] Emails de teste enviados

---

**🎊 Desenvolvido com ❤️ para Samuel & Patrícia - 17 de Maio de 2026 🎊**
