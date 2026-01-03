# 🚀 API MIGRADA PARA REPOSITÓRIO SEPARADO

## ⚠️ ATENÇÃO

A API foi movida para um repositório separado para facilitar o deploy no Render.

## 📦 Novo Repositório da API

**URL:** https://github.com/bfrpaulondev/samuel-patricia-wedding-api

## 🎯 Por Quê?

A Vercel Serverless estava tendo problemas com o deploy da API. 
A solução foi criar um repositório separado e fazer deploy no **Render**, que funciona melhor para APIs Node.js tradicionais.

## 🏗️ Arquitetura Atual

```
┌─────────────────────────────────────┐
│  Frontend (React + Vite)            │
│  Repositório: samuel-patricia-      │
│              wedding-site           │
│  Deploy: Vercel                     │
│  URL: samuel-patricia-wedding-      │
│       site.vercel.app               │
└──────────────┬──────────────────────┘
               │
               │ API Calls
               ▼
┌─────────────────────────────────────┐
│  Backend (Express + MongoDB)        │
│  Repositório: samuel-patricia-      │
│              wedding-api            │
│  Deploy: Render                     │
│  URL: wedding-api.onrender.com      │
└─────────────────────────────────────┘
```

## 📝 Próximos Passos

1. **Deploy da API no Render**
   - Repositório: https://github.com/bfrpaulondev/samuel-patricia-wedding-api
   - Siga o guia: `RENDER-DEPLOY.md`

2. **Atualizar Frontend**
   - Configurar `VITE_API_URL` na Vercel
   - Apontar para URL do Render
   - Fazer redeploy

3. **Testar Integração**
   - Formulário de confirmação
   - Login admin
   - Dashboard

## 🔗 Links

- **API Repo:** https://github.com/bfrpaulondev/samuel-patricia-wedding-api
- **Frontend Repo:** https://github.com/bfrpaulondev/samuel-patricia-wedding-site
- **Render:** https://render.com/
- **Vercel:** https://vercel.com/

---

**Desenvolvido com ❤️ para Samuel & Patrícia**  
**17 de Maio de 2026** 🎊
