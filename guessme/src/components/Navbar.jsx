import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar({ onRestart, disabled }) {
  return (
    <nav className="navbar navbar-dark dark-navbar px-4">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">🎮 GuessMe</span>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-light" onClick={onRestart} disabled={disabled}>
            Reiniciar
          </button>
        </div>
      </div>
    </nav>
  );
}
