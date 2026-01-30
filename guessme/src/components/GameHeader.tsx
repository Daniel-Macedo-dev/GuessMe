type Props = {
  onRestart: () => void;
};

export default function GameHeader({ onRestart }: Props) {
  return (
    <div className="gameHeader">
      <div>
        <h2 className="h2">Partida</h2>
        <p className="muted">Pergunte com sim/não e tente adivinhar.</p>
      </div>

      <div className="row">
        <button className="btn" onClick={onRestart}>
          Reiniciar
        </button>
      </div>
    </div>
  );
}
