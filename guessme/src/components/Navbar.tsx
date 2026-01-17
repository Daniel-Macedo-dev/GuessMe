type Props = { onRestart: () => void; disabled?: boolean };

export default function Navbar({ onRestart, disabled = false }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <span style={{ fontSize: 18 }}>🎮</span>
        <span>GuessMe</span>
        <span className="by">by Daniel Macedo</span>
      </div>

      <button className="btn" onClick={onRestart} disabled={disabled}>
        Reiniciar
      </button>
    </header>
  );
}
