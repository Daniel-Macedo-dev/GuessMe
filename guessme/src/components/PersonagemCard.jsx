export default function PersonagemCard() {
  return (
    <div className="card p-3 text-center shadow">
      <h3>Bem-vindo ao GuessMe!</h3>
      <p className="text-muted">
        A IA escolherá um personagem e você deve adivinhar fazendo perguntas.
      </p>
      <img
        src="https://i.imgur.com/52xMt5W.png"
        alt="Mascote"
        className="img-fluid"
        style={{ maxWidth: "200px", margin: "0 auto" }}
      />
    </div>
  );
}
