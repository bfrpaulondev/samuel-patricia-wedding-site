# 🚀 DEPLOY NA VERCEL - STATUS E PRÓXIMOS PASSOS

## ✅ STATUS ATUAL DO DEPLOY

**Commit:** `862de95` - Refactor API for Vercel Serverless deployment  
**Branch:** `main`  
**Build Status:** 🟡 Em progresso...

**Logs do Build:**
```
Running build in Washington, D.C., USA (East) – iad1
Build machine configuration: 2 cores, 8 GB
Cloning completed: 412.000ms
Installing dependencies... ✅
yarn install completed in 60.38s ✅
Running: tsc -b && vite build 🟡 (em progresso)
```

---

## 📋 CHECKLIST PÓS-DEPLOY

### 1. ⏳ Aguardar Build Completo
- [ ] Build do TypeScript concluído
- [ ] Build do Vite concluído
- [ ] Deploy finalizado
- [ ] URL de produção disponível

### 2. 🔧 Configurar Variáveis de Ambiente

**CRÍTICO:** A API não funcionará sem as variáveis de ambiente!

Acesse: https://vercel.com/ → `samuel-patricia-wedding-site` → **Settings** → **Environment Variables**

Adicione as seguintes variáveis (todas marcadas para Production, Preview e Development):

| Variável | Valor |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://bfrpaulondev_db_user:Ci85Wu3bZ0iooagG@cluster0.mp369cb.mongodb.net/wedding-app?retryWrites=true&w=majority` |
| `JWT_SECRET` | `NoivosSamuelPatricia2026` |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` (só Production) |
| `CORS_ORIGIN` | `https://samuel-patricia-wedding-site.vercel.app` |
| `ADMIN_USERNAME` | `samuel` |
| `ADMIN_EMAIL` | `samuel@casamento.com` |
| `ADMIN_PASSWORD` | `NoivosSamuelPatricia2026!` |

### 3. 🔄 Redeploy Após Configurar Variáveis

**IMPORTANTE:** Variáveis de ambiente só são aplicadas após redeploy!

1. Vá para **Deployments**
2. Clique nos **3 pontos (...)** do último deployment
3. Selecione **Redeploy**
4. Aguarde o novo deploy (2-3 minutos)

### 4. ✅ Testar Endpoints da API

#### A. Health Check
```bash
curl https://samuel-patricia-wedding-site.vercel.app/api/health
```

**Resposta esperada:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-02T...",
  "mongodb": "connected"
}
```

❌ Se `"mongodb": "disconnected"` → Verificar MONGODB_URI e MongoDB Atlas whitelist

#### B. Raiz da API
```bash
curl https://samuel-patricia-wedding-site.vercel.app/api
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Wedding Confirmation API - Samuel & Patrícia",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "confirmations": "/api/confirmations",
    "admin": "/api/admin",
    "docs": "/api/api-docs"
  },
  "wedding": {
    "couple": "Samuel & Patrícia",
    "date": "2026-05-17",
    "location": "Setúbal, Portugal"
  }
}
```

#### C. Criar Confirmação de Teste
```bash
curl -X POST https://samuel-patricia-wedding-site.vercel.app/api/confirmations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Teste Produção",
    "email": "teste@producao.com",
    "willAttend": true,
    "numberOfGuests": 2,
    "message": "Teste de confirmação em produção"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Confirmação enviada com sucesso!",
  "data": {
    "id": "...",
    "fullName": "Teste Produção",
    "email": "teste@producao.com",
    "willAttend": true,
    "status": "pending"
  }
}
```

#### D. Login Admin
```bash
curl -X POST https://samuel-patricia-wedding-site.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "samuel",
    "password": "NoivosSamuelPatricia2026!"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "...",
      "username": "samuel",
      "email": "samuel@casamento.com",
      "role": "superadmin"
    }
  }
}
```

### 5. 🌐 Testar Frontend

#### A. Página Principal
Acesse: https://samuel-patricia-wedding-site.vercel.app/

**Deve mostrar:**
- ✅ Countdown até 17 de Maio de 2026
- ✅ Formulário de confirmação funcionando
- ✅ Mapas dos locais (Cerimônia e Festa)
- ✅ Design responsivo e animações

#### B. Testar Formulário
1. Preencha o formulário de confirmação
2. Clique em "Confirmar Presença"
3. Deve mostrar mensagem de sucesso
4. Verifique confetti e animação

#### C. Painel Admin
Acesse: https://samuel-patricia-wedding-site.vercel.app/admin/login

1. Faça login com:
   - Username: `samuel`
   - Password: `NoivosSamuelPatricia2026!`
2. Deve redirecionar para o dashboard
3. Verifique:
   - ✅ Estatísticas aparecem
   - ✅ Lista de confirmações carrega
   - ✅ Pode aprovar/rejeitar confirmações
   - ✅ Filtros funcionam

---

## 🐛 TROUBLESHOOTING COMUM

### Erro: API 404 ou 500

**Possíveis causas:**

1. **Variáveis de ambiente não configuradas**
   - Solução: Configure as variáveis e faça redeploy

2. **MongoDB Atlas bloqueando IP**
   - Acesse: MongoDB Atlas → Network Access
   - Adicione: `0.0.0.0/0` (Allow access from anywhere)

3. **Credenciais MongoDB inválidas**
   - Verifique: Database Access no MongoDB Atlas
   - Teste: Conexão local com a mesma URI

### Erro: CORS

**Sintoma:** Erro de CORS no console do navegador

**Solução:**
1. Verifique `CORS_ORIGIN` nas variáveis de ambiente
2. Deve ser: `https://samuel-patricia-wedding-site.vercel.app`
3. Faça redeploy após alterar

### Erro: Admin não existe

**Sintoma:** Login retorna "Credenciais inválidas"

**Solução:** Criar admin no banco
```bash
# Localmente
cd /home/user/webapp
npm run setup-admin

# Ou via script manual no MongoDB Atlas
# (ver VERCEL-ENV-CONFIG.md)
```

### Frontend carrega mas API não funciona

**Diagnóstico:**
1. Abra DevTools (F12) → Console
2. Veja se há erros de rede
3. Verifique a URL da requisição

**Soluções:**
- Se URL está errada: Verificar `src/services/api.ts`
- Se 404: Verificar `vercel.json` rewrites
- Se 500: Verificar logs da Vercel

---

## 📊 ARQUITETURA EM PRODUÇÃO

```
┌──────────────────────────────────────────┐
│  Usuário                                  │
│  (navegador)                              │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│  Vercel CDN + Static Hosting             │
│  (React App - dist/)                     │
│                                           │
│  https://samuel-patricia-wedding-site    │
│         .vercel.app/                     │
└────────────────┬─────────────────────────┘
                 │
                 │ /api/*
                 ▼
┌──────────────────────────────────────────┐
│  Vercel Serverless Function              │
│  (api/index.ts)                          │
│                                           │
│  - Express.js handler                    │
│  - JWT authentication                    │
│  - Rate limiting                         │
│  - Input validation                      │
└────────────────┬─────────────────────────┘
                 │
                 │ mongoose.connect()
                 ▼
┌──────────────────────────────────────────┐
│  MongoDB Atlas                           │
│  (Cloud Database)                        │
│                                           │
│  Collections:                            │
│  - confirmations                         │
│  - admins                                │
└──────────────────────────────────────────┘
```

---

## 🔐 SEGURANÇA PÓS-DEPLOY

### Imediato (Crítico):

1. **Alterar senha do admin**
   - Login: https://samuel-patricia-wedding-site.vercel.app/admin/login
   - Alterar senha padrão

2. **Rotacionar JWT_SECRET**
   - Gerar novo secret: `openssl rand -base64 32`
   - Atualizar na Vercel
   - Redeploy

3. **Configurar CORS corretamente**
   - Remover `*` (allow all)
   - Usar apenas domínio específico

### Recomendado:

4. **Habilitar 2FA no MongoDB Atlas**
5. **Configurar alertas de erro na Vercel**
6. **Monitorar logs de acesso**
7. **Backup regular do MongoDB**

---

## 📝 DOCUMENTAÇÃO DISPONÍVEL

- `README-API.md` - Documentação da API
- `DEPLOY-GUIDE.md` - Guia de deploy geral
- `VERCEL-ENV-CONFIG.md` - Configuração de variáveis
- `TESTE-ROTAS-REPORT.md` - Relatório de testes locais
- `INSTRUCOES-FINAIS.md` - Instruções finais

---

## ✅ CHECKLIST FINAL

- [ ] Build da Vercel concluído com sucesso
- [ ] Variáveis de ambiente configuradas
- [ ] Redeploy realizado
- [ ] Health check retorna OK
- [ ] MongoDB conectado
- [ ] Frontend carregando
- [ ] Formulário funcionando
- [ ] Admin consegue fazer login
- [ ] Dashboard carrega estatísticas
- [ ] Pode aprovar/rejeitar confirmações
- [ ] Senha do admin alterada
- [ ] CORS configurado corretamente
- [ ] MongoDB Atlas com IP whitelist

---

## 🎉 PRÓXIMOS PASSOS APÓS TUDO FUNCIONANDO

1. **Testes de Usabilidade**
   - Pedir para amigos testarem o formulário
   - Verificar em diferentes dispositivos
   - Testar em diferentes navegadores

2. **Personalizações Opcionais**
   - Adicionar fotos do casal
   - Customizar cores/tema
   - Adicionar mais informações

3. **Monitoramento**
   - Configurar alertas no Vercel
   - Monitorar erros no MongoDB
   - Verificar estatísticas de confirmações

4. **Backup**
   - Configurar backup automático no MongoDB Atlas
   - Exportar lista de confirmados regularmente

---

**Desenvolvido com ❤️ para Samuel & Patrícia**  
**Casamento: 17 de Maio de 2026 🎊**

**Status:** 🟢 Pronto para produção (aguardando configuração de env vars)
