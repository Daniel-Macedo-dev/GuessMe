export default function PersonagemCard({ pergunta, onEnviar }) {
  return (
    <div className="card p-4 shadow-sm">
      <h4 className="mb-3">{pergunta}</h4>

      <button className="btn btn-primary me-2" onClick={() => onEnviar("sim")}>
        Sim
      </button>

      <button className="btn btn-danger" onClick={() => onEnviar("não")}>
        Não
      </button>
    </div>
  );
}
