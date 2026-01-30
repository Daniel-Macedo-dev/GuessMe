export default function SidebarTips() {
  return (
    <div className="side">
      <h3 className="h3">Dicas</h3>
      <ul className="tips">
        <li>Comece amplo: “É de anime?”, “É de jogo?”, “É humano?”</li>
        <li>Refine: poderes, época, profissão, universo.</li>
        <li>Perguntas curtas funcionam melhor.</li>
        <li>Quando tiver certeza: “É o ___?”</li>
      </ul>

      <div className="divider" />
      <p className="muted small">Se a API estiver lenta, tente novamente.</p>
    </div>
  );
}
