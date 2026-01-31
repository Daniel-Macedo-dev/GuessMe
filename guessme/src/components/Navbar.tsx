import { Link, useLocation } from "react-router-dom";

type Props = {
  onRestart?: () => void;
  disabled?: boolean;
};

export default function Navbar({ onRestart, disabled = false }: Props) {
  const { pathname } = useLocation();

  return (
    <header className="topbar">
      <div className="topbarInner">
        <Link className="brand" to="/">
          GuessMe
        </Link>

        <nav className="nav">
          <Link className={`navLink ${pathname === "/" ? "active" : ""}`} to="/">
            Home
          </Link>
          <Link className={`navLink ${pathname === "/how-it-works" ? "active" : ""}`} to="/how-it-works">
            Como funciona
          </Link>
          <Link className={`navLink ${pathname === "/game" ? "active" : ""}`} to="/game">
            Jogo
          </Link>
        </nav>

        {onRestart ? (
          <button className="btn" onClick={onRestart} disabled={disabled}>
            Reiniciar
          </button>
        ) : (
          <span />
        )}
      </div>
    </header>
  );
}
