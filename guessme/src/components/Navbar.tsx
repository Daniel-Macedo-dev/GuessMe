import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
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

          <Link
            className={`navLink ${pathname === "/game" ? "active" : ""}`}
            to="/game"
          >
            Jogo
          </Link>

          <Link
            className={`navLink ${pathname === "/how-it-works" ? "active" : ""}`}
            to="/how-it-works"
          >
            Como funciona
          </Link>
        </nav>
      </div>
    </header>
  );
}
