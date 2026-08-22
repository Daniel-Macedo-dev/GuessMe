import { Link, useLocation } from "react-router-dom";
import BrandMark from "./BrandMark";

type Props = {
  onRestart?: () => void;
  disabled?: boolean;
};

export default function Navbar({ onRestart, disabled = false }: Props) {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/how-it-works", label: "Como funciona" },
    { to: "/game", label: "Jogo" },
    { to: "/stats", label: "Estatísticas" },
  ];

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

        <nav className="nav" aria-label="Navegação principal">
          {links.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                className={`navLink ${active ? "active" : ""}`}
                to={to}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
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
