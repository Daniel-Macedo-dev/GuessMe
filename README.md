# 🧩 GuessMe

Aplicação **backend** desenvolvida em **Spring Boot (Java 25)** com o objetivo de criar um **jogo de adivinhação de personagens**.
O jogador faz perguntas e a aplicação responde até que o personagem seja descoberto.

> 🔧 A integração com a **IA da OpenAI** ainda será implementada — por enquanto, o projeto encontra-se em fase de estruturação.

## 🎯 Objetivo

Explorar a integração entre **backend Java** e **IA generativa**, criando uma API que suporte um frontend interativo (ex.: React).
Nesta primeira etapa, o foco está na **estruturação do projeto**, **definição dos endpoints REST** e **preparo para futuras integrações**.

## 🧱 Tecnologias utilizadas

* **Java 25**
* **Spring Boot 3.5.7**
* **Maven**
* **Spring WebFlux** (para chamadas assíncronas com `WebClient`)

## 📁 Estrutura do projeto

```bash
GuessMe/
├── src/
│   ├── main/java/com/guessme/guessme/
│   │   ├── controller/        # Endpoints REST (start, ask)
│   │   ├── service/           # Lógica do jogo (estrutura base)
│   │   ├── dto/               # DTOs para respostas (ex.: AIResponse)
│   │   └── GuessMeApplication.java
│   └── resources/
│       └── application.properties
├── pom.xml
└── README.md
```
## 🚀 Como executar localmente

1. Certifique-se de ter o **Java 25** e o **Maven** instalados.
2. (Opcional) Configure a variável de ambiente para integração futura com a IA:

   ```bash
   setx OPENAI_API_KEY "sua_chave_aqui"
   ```
3. Execute o projeto:

   ```bash
   mvn spring-boot:run
   ```
4. A aplicação estará disponível em:

   ```
   http://localhost:8080
   ```
## 📌 Endpoints principais

```bash
GET  /api/game/start    # Inicia o jogo (IA escolhe o personagem)
POST /api/game/ask      # Envia uma pergunta (JSON: { "question": "..." })
```

**Exemplo de resposta:**

```json
{
  "response": "Sim, o personagem é real."
}
```

## 🛠 Estado atual do projeto

* ✅ Estrutura base do backend criada
* ✅ Endpoints principais definidos
* ⏳ Integração com OpenAI pendente (necessita chave de API ativa)
* 🧩 Frontend em React planejado, mas ainda não implementado

## 📅 Próximos passos

* Implementar a comunicação com a OpenAI usando `WebClient`
* Adicionar memória de contexto para o histórico de perguntas
* Desenvolver o frontend React (interface do jogo)
* Criar testes automatizados e documentação de deploy

## 📄 Licença

**MIT License** — uso livre, mediante créditos ao autor.
