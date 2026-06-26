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
- **Bootstrap 5** (CSS only)
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

### Notas por plataforma

**Vercel / Netlify / GitHub Pages**

Faça upload da pasta `dist/` ou conecte o repositório. Configure a variável de ambiente `VITE_API_BASE_URL` nas configurações do projeto da plataforma antes de acionar o build.

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

---

## ⚙️ CI (GitHub Actions)

O repositório possui um workflow em `.github/workflows/ci.yml` que executa automaticamente em push e pull request para `main`:

- configura Node 22 com cache npm
- instala dependências com `npm ci`
- executa `npm run lint`
- executa `npm run build` (sem credenciais de API — build usa fallback para `http://localhost:8080`)

---

## 🔗 Projeto Relacionado

Este frontend foi criado para funcionar em conjunto com a **GuessMe API**, responsável por processar as perguntas do usuário e retornar as respostas da inteligência artificial.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.
