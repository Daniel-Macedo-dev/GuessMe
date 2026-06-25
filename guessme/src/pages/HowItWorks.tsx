import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HowItWorks() {
  return (
    <div className="shell">
      <Navbar />

      <main className="main">
        <section className="panel pagePanel">
          <h2 className="h2">Manual do investigador</h2>
          <p className="muted">
            Cada pergunta é uma pista. Use-as com precisão.
          </p>

          <div className="divider" />

          <ul className="list">
            <li>Perguntas curtas e diretas funcionam melhor.</li>
            <li>Comece amplo: categoria, forma, universo. Depois feche o cerco.</li>
            <li>Se travar, solicite uma pista para desbloquear a investigação.</li>
            <li>Quando tiver certeza, confronte o suspeito: "É o ___?"</li>
          </ul>

          <div className="divider" />

          <div className="row">
            <Link className="btn btn-primary" to="/game">
              Abrir caso
            </Link>
            <Link className="btn" to="/">
              Voltar
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
