import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HowItWorks() {
  return (
    <div className="shell">
      <Navbar />

      <main className="main">
        <section className="panel pagePanel">
          <h2 className="h2">Como funciona</h2>
          <p className="muted">
            Faça perguntas de sim/não. Quando tiver certeza, chute o nome.
          </p>

          <div className="divider" />

          <ul className="list">
            <li>Perguntas curtas funcionam melhor.</li>
            <li>Comece amplo e depois refine.</li>
            <li>Se travar, use o botão “Pedir dica”.</li>
            <li>Quando achar que sabe, pergunte direto: “É o ___?”</li>
          </ul>

          <div className="divider" />

          <div className="row">
            <Link className="btn btn-primary" to="/game">
              Ir para o jogo
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
