export default function PersonagemCard() {
  return (
    <div className="card persona-card shadow-sm p-3 text-center">
      <h3 className="mb-1">Bem-vindo ao GuessMe!</h3>
      <p className="text-muted small">
        A IA escolherá um personagem — faça perguntas de sim/não até acertar.
      </p>
      <img
        src="https://i.imgur.com/52xMt5W.png"
        alt="Mascote"
        className="img-fluid"
        style={{ maxWidth: 180, margin: "0 auto" }}
      />
    </div>
  );
}
