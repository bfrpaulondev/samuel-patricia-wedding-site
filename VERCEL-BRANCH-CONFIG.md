# 🔧 Configurar Branch Principal na Vercel

## 📍 Situação Atual

- ✅ Branch `main` está **100% atualizada** (commit `588e7d5`)
- ✅ Branch `feature/api-admin-panel` está **100% sincronizada** com `main`
- ⚠️ Vercel está fazendo deploy de `feature/api-admin-panel` (conforme log de build)

## 🎯 Objetivo

Configurar a Vercel para fazer deploy da branch **`main`** ao invés de `feature/api-admin-panel`

---

## 📝 Passo a Passo

### 1. Acessar o Dashboard da Vercel

1. Vá para: https://vercel.com/
2. Faça login (usuário: `bfrpaulondev`)
3. Selecione o projeto: **`samuel-patricia-wedding-site`**

### 2. Acessar Configurações do Projeto

1. Clique em **"Settings"** (⚙️ no menu superior)
2. No menu lateral, clique em **"Git"**

### 3. Alterar a Branch de Produção

Na seção **"Production Branch"**:

1. Você verá algo como:
   ```
   Production Branch: feature/api-admin-panel
   ```

2. Clique no campo ou no botão **"Edit"**

3. Digite: `main`

4. Clique em **"Save"** ou **"Update"**

### 4. Fazer um Redeploy

Após alterar a branch:

1. Vá para **"Deployments"** (no menu superior)
2. Encontre o último deployment
3. Clique nos **3 pontinhos** (⋯) ao lado do deployment
4. Clique em **"Redeploy"**
5. **IMPORTANTE:** Desmarque "Use existing Build Cache"
6. Clique em **"Redeploy"** para confirmar

### 5. Aguardar o Build

O build levará **2-3 minutos**. Você verá o progresso em tempo real.

---

## ✅ Verificação

Após o deploy, verifique se funcionou:

### Método 1: Navegador
1. Abra: https://samuel-patricia-wedding-site.vercel.app/
2. Pressione **CTRL + F5** (force refresh para limpar cache)
3. Verifique se:
   - ✅ Nomes "Samuel & Patrícia" aparecem com a fonte **Tangerine** (letra cursiva elegante)
   - ✅ Seção de presentes com números MBway está visível
   - ✅ Checkbox de consentimento LGPD no formulário

### Método 2: Terminal (linha de comando)
```bash
# Ver hash dos arquivos (deve mudar para um novo valor)
curl -s https://samuel-patricia-wedding-site.vercel.app/ | grep "\.css"

# Verificar se Tangerine está no CSS
curl -s https://samuel-patricia-wedding-site.vercel.app/assets/index-*.css | grep -i tangerine
```

---

## 🔍 Como Saber se Está Usando a Branch Correta?

Nos logs de build da Vercel, você verá:

### ❌ ANTES (errado):
```
Cloning github.com/bfrpaulondev/samuel-patricia-wedding-site (Branch: feature/api-admin-panel, ...)
```

### ✅ DEPOIS (correto):
```
Cloning github.com/bfrpaulondev/samuel-patricia-wedding-site (Branch: main, ...)
```

---

## 📦 Alterações Implementadas (já commitadas)

### 1. Fonte Tangerine
- ✅ Adicionada no `src/index.css` via `@import`
- ✅ Aplicada nos nomes do hero, presentes e footer
- ✅ Peso: 700 (bold)

### 2. Imagem de Boas-Vindas
- ✅ Arquivo: `/public/bible-quote.jpg` (versículo bíblico)
- ✅ Seção "Sejam Bem-Vindos!" com a imagem

### 3. Seção de Presentes
- ✅ Cards com MBway:
  - Patrícia: +351 931 740 492
  - Samuel: +351 933 245 603

### 4. Checkbox LGPD
- ✅ Campo obrigatório no formulário
- ✅ Botão desabilitado até marcar

### 5. Correções Técnicas
- ✅ Removidos caracteres UTF-8 que causavam erro de build
- ✅ Fonte importada no CSS (não só no HTML)

---

## 🚨 Troubleshooting

### Se não funcionar após seguir os passos:

1. **Limpar Cache do Navegador:**
   - Chrome/Edge: CTRL + SHIFT + DELETE → Limpar "Imagens e arquivos em cache"
   - Firefox: CTRL + SHIFT + DELETE → Marcar "Cache"

2. **Verificar Branch na Vercel:**
   - Settings → Git → Production Branch deve estar como `main`

3. **Forçar novo deploy:**
   - Deployments → Redeploy → **DESMARCAR** "Use existing Build Cache"

4. **Verificar logs de build:**
   - Deployments → Clicar no deployment → Ver logs
   - Procurar por erros (linha vermelha)

---

## 📞 Suporte

Se precisar de ajuda adicional:
- GitHub Repo: https://github.com/bfrpaulondev/samuel-patricia-wedding-site
- Branch principal: `main`
- Último commit: `588e7d5`

---

## ✨ Resultado Esperado

Após configurar corretamente, o site em **https://samuel-patricia-wedding-site.vercel.app/** terá:

✅ Fonte **Tangerine** nos nomes dos noivos (cursiva elegante e grande)  
✅ Imagem com versículo bíblico na seção de boas-vindas  
✅ Seção de presentes com MBway dos noivos  
✅ Checkbox de consentimento LGPD no formulário  
✅ Design completo e responsivo  

---

*Última atualização: 03 de Janeiro de 2026*  
*Commit: 588e7d5*  
*Branch: main*
