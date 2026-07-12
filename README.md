# 🎭 GuessMe

Frontend web do **GuessMe**, desenvolvido para permitir a interação do usuário com a inteligência artificial responsável pelo jogo de adivinhação de personagens.  
A aplicação consome a **GuessMe API**, enviando perguntas, exibindo respostas e conduzindo o fluxo da partida em uma interface web moderna.

---


## 📌 Visão Geral

O **GuessMe** é a interface visual do jogo, criada para proporcionar uma experiência de interação simples e dinâmica entre o usuário e a IA.

Com este frontend, o usuário pode:

- iniciar a experiência do jogo pela interface web
- enviar perguntas para a API
- visualizar as respostas geradas pela inteligência artificial
- acompanhar o fluxo da partida de adivinhação de personagens
- consumir os recursos disponibilizados pelo backend de forma integrada

---

## 🧱 Tecnologias Utilizadas

- **React 19**
- **Vite 7**
- **TypeScript**
- **React Router DOM**
- **CSS customizado** (sem framework — tema Casefile Noir)
- **Inter + JetBrains Mono** (Google Fonts)
- **ESLint**

---

## 🏛️ Estrutura do Projeto

O projeto foi construído como uma aplicação frontend moderna com Vite, utilizando React para a interface e integração com a API do jogo.

### Estrutura base confirmada

- `guessme/` — aplicação frontend principal
- `src/` — código-fonte da interface
- `package.json` — dependências e scripts do projeto
- `vite.config.js` — configuração do Vite

---

## 🚀 Funcionalidades

- Interface web para interação com a inteligência artificial
- Envio de perguntas para a GuessMe API
- Exibição das respostas retornadas pela API
- Controle do fluxo do jogo de adivinhação de personagens
- Navegação entre telas com React Router DOM
- Estrutura preparada para evolução da experiência do usuário

---

## 🔄 Integração com a GuessMe API

O frontend foi desenvolvido para consumir a **GuessMe API**, sendo responsável pela camada de interação com o usuário, enquanto a lógica principal do jogo e o processamento das respostas ficam no backend. 

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

Antes de iniciar, tenha instalado:

- **Node.js**
- **npm**

### 1. Clone o repositório

```bash
git clone https://github.com/Daniel-Macedo-dev/GuessMe.git
````

### 2. Acesse a pasta do projeto

```bash
cd GuessMe/guessme
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente (opcional)

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

| Variável            | Padrão                    | Descrição                        |
|---------------------|---------------------------|----------------------------------|
| `VITE_API_BASE_URL` | `http://localhost:8080`   | URL base da GuessMe API          |

> Se `VITE_API_BASE_URL` não estiver definida, o frontend usa `http://localhost:8080` automaticamente — configuração correta para rodar o backend localmente com as configurações padrão.

### 5. Execute em ambiente de desenvolvimento

```bash
npm run dev
```

A aplicação será iniciada localmente pelo Vite.

---

## 🏗️ Build de Produção

Para gerar a build de produção:

```bash
npm run build
```

Para visualizar a build localmente:

```bash
npm run preview
```

---

## 🧪 Scripts Disponíveis

| Script            | Descrição                                     |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento com Vite |
| `npm run build`   | Gera a build de produção                      |
| `npm run preview` | Executa a pré-visualização da build           |
| `npm run lint`    | Executa a análise de lint do projeto          |

Esses scripts estão definidos no `package.json`.

---

## 🔗 Integração Full-Stack (rodando localmente)

Para rodar o frontend com o backend real da GuessMe API localmente:

**Terminal 1 — backend (guessme-api):**

```powershell
cd guessme-api/guessme
.\mvnw.cmd spring-boot:run
# → http://localhost:8080
```

**Terminal 2 — frontend (GuessMe):**

```bash
cd GuessMe/guessme
npm install
npm run dev
# → http://localhost:5173
```

> O CORS padrão do backend já aceita `http://localhost:5173`. Nenhuma configuração adicional é necessária para desenvolvimento local.

### Smoke checklist local (full-stack)

| Verificação | Ação | Resultado esperado |
|---|---|---|
| Backend ativo | `GET /api/game/health` | `{"status":"ok"}` |
| Categorias carregadas | Abrir `/game` | Dropdown de domínio populado com 6 opções |
| Início de sessão | Abrir `/game` | Mensagem de abertura do caso + chat ativo |
| Pergunta normal | Enviar pergunta por texto ou chip | Bolha de resposta ("Sim" verde / "Não" vermelho / "Talvez" âmbar) |
| Pergunta longa (301+ chars) | Digitar mais de 300 chars | Contador vermelho; botão Enviar desabilitado |
| Cooldown (< 3 s) | Duas perguntas rápidas | Aviso âmbar "Aguarde alguns instantes…" |
| Limite de perguntas | 50+ perguntas na mesma sessão | Aviso âmbar "Limite de perguntas atingido…" |
| Pista | Clicar "Solicitar pista" | Bolha âmbar com texto de dica |
| Sessão inválida | `POST /api/game/ask` com sessionId inexistente | Box de erro vermelho + botão "Novo caso" |
| Gemini sem chave real | `/ask` ou `/hint` com `gemini.properties` contendo placeholder | Box de erro vermelho com `Erro da API Gemini (400): API key not valid…` |
| Novo caso | Clicar "Novo caso" | Chat reinicia com nova mensagem de abertura |
| Troca de categoria | Selecionar outro domínio | Chat reinicia na nova categoria |
| Rota direta `/game` | Abrir diretamente no navegador | Renderiza corretamente (SPA routing) |
| Rota direta `/how-it-works` | Abrir diretamente no navegador | Renderiza corretamente (SPA routing) |

### Estados de erro esperados com `gemini.properties` placeholder

Se `gemini.properties` contiver `YOUR_GEMINI_API_KEY_HERE` (valor padrão), o backend iniciará normalmente mas as chamadas a `/ask` e `/hint` retornarão:

```
Erro da API Gemini (400): API key not valid. Please pass a valid API key.
```

O frontend exibe esse erro em um box vermelho. Para usar o Gemini de verdade, substitua o placeholder pelo seu valor real em `guessme/src/main/resources/gemini.properties`.

> **Nunca comite `gemini.properties` com a chave real.** O arquivo está listado no `.gitignore` e não deve ser incluído em commits.

---

## 🧠 Objetivo do Projeto

Este projeto foi desenvolvido com foco em:

* prática de frontend moderno com React + Vite
* integração entre frontend e backend orientado a IA
* construção de experiência interativa para jogo web
* organização de interface para consumo de API
* composição de portfólio com projeto integrado

---

## 🚀 Deploy em Produção

### Checklist antes de publicar

- [ ] Backend GuessMe API está rodando e acessível publicamente
- [ ] `VITE_API_BASE_URL` aponta para a URL real do backend (ex: `https://sua-api.com`)
- [ ] CORS no backend configurado para aceitar a origem do frontend (`CORS_ALLOWED_ORIGINS`)
- [ ] `npm run build` passa sem erros antes do deploy
- [ ] Pasta `dist/` publicada em um serviço de hospedagem estática

### Build de produção

```bash
# 1. Defina a URL do backend
echo "VITE_API_BASE_URL=https://sua-api.com" > .env

# 2. Gere o build
npm run build

# 3. O build estático estará em: dist/
```

### Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e importe o repositório `GuessMe` do GitHub.
2. Em **Root Directory**, defina `guessme` (onde está o `package.json`).
3. Framework Preset: **Vite** (detectado automaticamente).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Em **Environment Variables**, adicione:

| Variável            | Valor                                                    |
|---------------------|----------------------------------------------------------|
| `VITE_API_BASE_URL` | URL real do backend (ex: `https://minha-api.onrender.com`) |

> `VITE_API_BASE_URL` é embutida no bundle em **tempo de build** pelo Vite. Qualquer alteração exige um novo deploy.

7. O arquivo `vercel.json` (em `guessme/`) configura rewrites para SPA routing:
   - `/game` e `/how-it-works` abertos diretamente no navegador funcionam corretamente.
   - Sem esse arquivo, o Vercel retornaria 404 para rotas client-side acessadas diretamente.

### Notas por plataforma

**Netlify / GitHub Pages**

Conecte o repositório e configure `VITE_API_BASE_URL` nas configurações do projeto antes de acionar o build. Para Netlify, adicione um arquivo `_redirects` em `public/` com `/* /index.html 200` para SPA routing.

**VPS / servidor próprio**

Sirva o conteúdo de `dist/` com qualquer servidor HTTP estático (Nginx, Apache, `serve`, etc.). Configure `VITE_API_BASE_URL` como variável de build.

> **Atenção:** a variável `VITE_API_BASE_URL` é embutida em tempo de build pelo Vite. Alterar a variável exige um novo `npm run build`.

---

## 🐳 Docker

> **Atenção:** `VITE_API_BASE_URL` é embutida no bundle em **tempo de build** pelo Vite.
> É necessário passar o valor correto como argumento de build — não é possível alterá-lo em tempo de execução.

### Build da imagem

```bash
# Desenvolvimento local (padrão: http://localhost:8080)
docker build -t guessme-frontend:local .

# Produção (substitua pela URL real do backend)
docker build --build-arg VITE_API_BASE_URL=https://sua-api.com -t guessme-frontend:prod .
```

### Executar o container

```bash
docker run --rm -p 4173:80 guessme-frontend:local
# Acesse em http://localhost:4173
```

### nginx e SPA routing

O container usa um `nginx.conf` customizado com `try_files $uri $uri/ /index.html`, garantindo que o React Router DOM controle a navegação mesmo em acesso direto por URL:

- `/` → Home
- `/game` → Game
- `/how-it-works` → HowItWorks

Assets estáticos (`/assets/`, `/favicon.ico`) são servidos diretamente pelo nginx.

---

## ⚙️ CI (GitHub Actions)

O repositório possui um workflow em `.github/workflows/ci.yml` que executa automaticamente em push e pull request para `main`:

- configura Node 22 com cache npm
- instala dependências com `npm ci`
- executa `npm run lint`
- executa `npm run build` (sem credenciais de API — build usa fallback para `http://localhost:8080`)
- configura Docker Buildx e valida o build da imagem frontend com `VITE_API_BASE_URL=http://localhost:8080`
- imagens **não são publicadas** em nenhum registry

---

## 🔗 Projeto Relacionado

Este frontend foi criado para funcionar em conjunto com a **GuessMe API**, responsável por processar as perguntas do usuário e retornar as respostas da inteligência artificial.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.
