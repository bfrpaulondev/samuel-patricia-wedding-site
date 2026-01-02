# 🎊 Sistema de Confirmações de Casamento - COMPLETO! 🎊

## ✅ O que foi implementado

### 🔧 Backend API (Node.js + Express + MongoDB)
1. **API RESTful completa** com TypeScript
2. **MongoDB** com Mongoose (modelos Confirmation e Admin)
3. **Autenticação JWT** segura
4. **Rate Limiting** para proteção contra abuso
5. **Validação robusta** de todos os dados
6. **Documentação Swagger/OpenAPI** automática
7. **Segurança**: Helmet, CORS, bcrypt, express-validator

### 💎 Painel Administrativo
1. **Login seguro** para os noivos
2. **Dashboard** com estatísticas em tempo real
3. **Gerenciamento de confirmações**:
   - Aprovar/Rejeitar
   - Deletar
   - Filtrar por status
   - Ver detalhes completos
4. **Interface bonita** com Material-UI

### 🌐 Frontend Integrado
1. **Formulário conectado** com a API
2. **Validação** e feedback em tempo real
3. **Tratamento de erros** completo
4. **Design responsivo** mantido

---

## 🚀 PRÓXIMOS PASSOS

### 1. Configurar MongoDB Atlas (OBRIGATÓRIO)

**Acesse:** https://www.mongodb.com/cloud/atlas

1. Crie uma conta gratuita
2. Crie um novo cluster (cluster M0 é gratuito)
3. Clique em "Connect" → "Connect your application"
4. Copie a connection string (será algo como):
   ```
   mongodb+srv://usuario:senha@cluster.mongodb.net/wedding-app?retryWrites=true&w=majority
   ```

### 2. Configurar Variáveis de Ambiente

#### Para desenvolvimento local:
```bash
# Edite o arquivo .env
MONGODB_URI=sua-connection-string-aqui
JWT_SECRET=uma-chave-secreta-muito-forte-aqui
CORS_ORIGIN=http://localhost:5173
```

#### Para produção (Vercel):
1. Acesse o dashboard da Vercel
2. Vá em Settings → Environment Variables
3. Adicione:
   - `MONGODB_URI`: Sua connection string do MongoDB Atlas
   - `JWT_SECRET`: Gere uma chave forte com: `openssl rand -base64 32`
   - `CORS_ORIGIN`: Domínio do seu site (ex: https://seu-site.vercel.app)
   - `NODE_ENV`: production

### 3. Criar Admin Inicial

```bash
# Localmente
npm run setup-admin

# Isso vai criar o primeiro usuário admin:
# Username: samuel (definido no .env)
# Senha: NoivosSamuelPatricia2026! (definido no .env)
```

**⚠️ IMPORTANTE:** Mude a senha após o primeiro login!

### 4. Testar Localmente

```bash
# Terminal 1 - Backend
npm run dev:api

# Terminal 2 - Frontend
npm run dev

# Ou ambos juntos:
npm run dev:all
```

**Acesse:**
- Frontend: http://localhost:5173
- Admin: http://localhost:5173/admin/login
- API: http://localhost:5000
- API Docs: http://localhost:5000/api-docs

### 5. Deploy na Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Siga as instruções e configure as variáveis de ambiente
```

---

## 📚 Estrutura do Projeto

```
wedding-pwa/
├── api/                          # Backend
│   ├── config/database.ts       # Conexão MongoDB
│   ├── models/                  # Models (Confirmation, Admin)
│   ├── routes/                  # Rotas (confirmations, admin)
│   ├── middleware/              # Auth, rate limiting, validação
│   ├── utils/jwt.ts             # Utilitários JWT
│   ├── setup-admin.ts           # Script criar admin
│   └── index.ts                 # Servidor principal
│
├── src/                         # Frontend
│   ├── pages/                   # AdminLogin, AdminDashboard
│   ├── services/api.ts          # Cliente API
│   ├── contexts/AuthContext.tsx # Context de autenticação
│   └── App.tsx                  # App principal (integrado)
│
├── .env.example                 # Exemplo de variáveis
├── .env                         # Suas variáveis (não commitar!)
├── vercel.json                  # Config Vercel
├── README-API.md                # Documentação completa
└── package.json                 # Scripts e dependências
```

---

## 🔗 Pull Request Criado

**Link:** https://github.com/bfrpaulondev/samuel-patricia-wedding-site/pull/1

---

## 🎯 Endpoints da API

### Público
- `POST /api/confirmations` - Enviar confirmação
- `GET /api/confirmations/check/:email` - Verificar confirmação

### Admin (Requer token JWT)
- `POST /api/admin/login` - Login
- `GET /api/admin/confirmations` - Listar confirmações
- `PATCH /api/admin/confirmations/:id/approve` - Aprovar
- `PATCH /api/admin/confirmations/:id/reject` - Rejeitar
- `DELETE /api/admin/confirmations/:id` - Deletar
- `GET /api/admin/stats` - Estatísticas

**Ver documentação completa:** `/api-docs`

---

## 🔐 Segurança Implementada

✅ JWT Authentication
✅ Rate Limiting (5 confirmações/hora, 5 logins/15min)
✅ Validação de input (express-validator)
✅ Hash de senhas (bcrypt)
✅ Headers de segurança (Helmet.js)
✅ CORS configurável
✅ Proteção contra SQL injection
✅ Sanitização de dados
✅ IP tracking para auditoria

---

## 💡 Dicas Importantes

1. **MongoDB Connection String:**
   - Substitua `<username>` e `<password>` pelos seus dados
   - Use IP Whitelist ou libere acesso de qualquer lugar (0.0.0.0/0)

2. **JWT Secret:**
   - Use uma chave forte e aleatória
   - NUNCA commite a chave no código
   - Gere com: `openssl rand -base64 32`

3. **Admin Password:**
   - Mude imediatamente após primeiro login
   - Use senha forte

4. **CORS:**
   - Em produção, configure apenas o domínio do seu site
   - Não use `*` em produção

5. **Rate Limiting:**
   - Ajuste os limites conforme necessário
   - Está em `api/middleware/rateLimiter.ts`

---

## 🆘 Troubleshooting

### Erro de conexão MongoDB
```
✗ Erro ao conectar ao MongoDB
```
**Solução:** Verifique a connection string e se o IP está na whitelist

### Token inválido
```
401 - Token inválido
```
**Solução:** Faça login novamente, o token pode ter expirado

### CORS Error
```
Access to XMLHttpRequest blocked by CORS
```
**Solução:** Configure `CORS_ORIGIN` no `.env` com o domínio correto

### Rate limit excedido
```
429 - Muitas tentativas
```
**Solução:** Aguarde alguns minutos antes de tentar novamente

---

## 📞 Contato e Suporte

Este projeto foi desenvolvido especialmente para o casamento de **Samuel & Patrícia**.

**Data do Casamento:** 17 de Maio de 2026 🎊

**Desenvolvido com ❤️**

---

## ✨ Próximas Melhorias (Opcionais)

- [ ] Envio de emails de confirmação
- [ ] Notificações push
- [ ] QR Code para check-in
- [ ] Lista de presentes integrada
- [ ] Galeria de fotos
- [ ] Mensagens dos convidados
- [ ] Exportar lista em Excel/PDF

---

**🎉 TUDO PRONTO PARA USO! 🎉**

Agora é só configurar o MongoDB e fazer o deploy! 🚀
