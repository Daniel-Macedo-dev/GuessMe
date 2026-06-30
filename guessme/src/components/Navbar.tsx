import { Link, useLocation } from "react-router-dom";
import BrandMark from "./BrandMark";

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
          <BrandMark size={28} className="brandMarkIcon" />
          <span className="brandText">
            <span className="brandName">GuessMe</span>
            <span className="brandSub" aria-hidden="true">Dossiê Digital</span>
          </span>
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
          <Link className={`navLink ${pathname === "/stats" ? "active" : ""}`} to="/stats">
            Estatísticas
          </Link>
        </nav>

        {onRestart ? (
          <button className="btn" onClick={onRestart} disabled={disabled}>
            Novo caso
          </button>
        ) : (
          <span />
        )}
      </div>
    </header>
  );
}
