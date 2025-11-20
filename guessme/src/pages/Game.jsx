import { useState } from "react";
import { askAI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Game() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const enviarPergunta = async (pergunta) => {
    setLoading(true);

    const resposta = await askAI(pergunta);

    setMessages((prev) => [
      ...prev,
      { tipo: "user", conteudo: pergunta },
      { tipo: "ai", conteudo: resposta.text },
    ]);

    setLoading(false);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Jogo</h2>

      {messages.map((msg, i) => (
        <div
          key={i}
          className={
            msg.tipo === "user"
              ? "alert alert-primary text-end"
              : "alert alert-secondary"
          }
        >
          {msg.conteudo}
        </div>
      ))}

      {loading && <LoadingSpinner />}

      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-success" onClick={() => enviarPergunta("sim")}>
          Sim
        </button>

        <button className="btn btn-danger" onClick={() => enviarPergunta("não")}>
          Não
        </button>

        <button
          className="btn btn-warning"
          onClick={() => enviarPergunta("perguntar")}
        >
          Fazer Pergunta
        </button>
      </div>
    </div>
  );
}
