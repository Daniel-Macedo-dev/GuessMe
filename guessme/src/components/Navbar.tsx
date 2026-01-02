import "bootstrap/dist/css/bootstrap.min.css";

type NavbarProps = {
  onRestart: () => void;
  disabled?: boolean;
};

export default function Navbar({ onRestart, disabled = false }: NavbarProps) {
  return (
    <nav className="navbar navbar-dark bg-dark shadow-sm px-4">
      <span className="navbar-brand mb-0 h1">🎮 GuessMe</span>
      <button
        className="btn btn-outline-light btn-sm"
        onClick={onRestart}
        disabled={disabled}
      >
        Reiniciar
      </button>
    </nav>
  );
}
