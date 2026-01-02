# 🔧 Configuração de Variáveis de Ambiente na Vercel

## Acesse as Configurações

1. Vá para: https://vercel.com/
2. Selecione o projeto: `samuel-patricia-wedding-site`
3. Clique em **Settings** → **Environment Variables**

---

## ⚙️ Variáveis Obrigatórias

Configure as seguintes variáveis de ambiente:

### 1. MongoDB
```
Nome: MONGODB_URI
Valor: mongodb+srv://bfrpaulondev_db_user:Ci85Wu3bZ0iooagG@cluster0.mp369cb.mongodb.net/wedding-app?retryWrites=true&w=majority
Environments: Production, Preview, Development
```

### 2. JWT Secret
```
Nome: JWT_SECRET
Valor: NoivosSamuelPatricia2026
Environments: Production, Preview, Development
```

### 3. JWT Expiration
```
Nome: JWT_EXPIRES_IN
Valor: 7d
Environments: Production, Preview, Development
```

### 4. Node Environment
```
Nome: NODE_ENV
Valor: production
Environments: Production only
```

### 5. CORS Origin
```
Nome: CORS_ORIGIN
Valor: https://samuel-patricia-wedding-site.vercel.app
Environments: Production, Preview, Development
```

⚠️ **IMPORTANTE:** Após o primeiro deploy, atualize `CORS_ORIGIN` com a URL real do projeto.

### 6. Admin Username
```
Nome: ADMIN_USERNAME
Valor: samuel
Environments: Production, Preview, Development
```

### 7. Admin Email
```
Nome: ADMIN_EMAIL
Valor: samuel@casamento.com
Environments: Production, Preview, Development
```

### 8. Admin Password
```
Nome: ADMIN_PASSWORD
Valor: NoivosSamuelPatricia2026!
Environments: Production, Preview, Development
```

---

## 🔄 Após Configurar

1. ✅ Salve todas as variáveis
2. ✅ Vá para **Deployments**
3. ✅ Clique nos 3 pontos do último deployment
4. ✅ Selecione **Redeploy**
5. ✅ Aguarde o novo deploy

---

## 🧪 Testar Após Deploy

### 1. Health Check
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

### 2. Criar Confirmação
```bash
curl -X POST https://samuel-patricia-wedding-site.vercel.app/api/confirmations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Teste Produção",
    "email": "teste@producao.com",
    "willAttend": true,
    "numberOfGuests": 2
  }'
```

### 3. Login Admin
```bash
curl -X POST https://samuel-patricia-wedding-site.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "samuel",
    "password": "NoivosSamuelPatricia2026!"
  }'
```

---

## 🔐 Segurança

⚠️ **IMPORTANTE:**

1. **Altere as credenciais do admin** após o primeiro login em produção
2. **Rotacione o JWT_SECRET** regularmente
3. **Use senhas fortes** para o admin
4. **Configure o CORS_ORIGIN** corretamente com a URL do seu domínio

---

## 📝 Notas

- As variáveis de ambiente são aplicadas apenas após um **redeploy**
- Variáveis podem ser diferentes para **Production**, **Preview** e **Development**
- Nunca commite o arquivo `.env` ou `.env.production` com credenciais reais
- Use o Vercel CLI para deployar localmente: `vercel env pull`

---

## 🚨 Troubleshooting

### Erro: FUNCTION_INVOCATION_FAILED
- ✅ Verificar se todas as variáveis estão configuradas
- ✅ Fazer redeploy após adicionar variáveis
- ✅ Verificar logs no Vercel Dashboard

### Erro: MongoDB connection failed
- ✅ Verificar se MONGODB_URI está correta
- ✅ Verificar se IP da Vercel está na whitelist do MongoDB Atlas
- ✅ MongoDB Atlas → Network Access → Add IP Address → Allow access from anywhere (0.0.0.0/0)

### Erro: CORS
- ✅ Atualizar CORS_ORIGIN com a URL correta do projeto
- ✅ Adicionar múltiplas origens separadas por vírgula se necessário

---

**Desenvolvido com ❤️ para Samuel & Patrícia**  
**Casamento: 17 de Maio de 2026**
