import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="shell">
      <Navbar />
      <main className="main mainCenter">
        <section className="panel hero">
          <div className="heroBadge">Jogo de Investigação</div>

          <h1 className="heroTitle">Desvende a identidade</h1>

          <p className="heroText">
            A IA escolheu um personagem. Você não sabe quem é. Interrogue com
            perguntas fechadas, acumule evidências e revele o suspeito.
          </p>

          <div className="heroActions">
            <Link className="btn btn-primary" to="/game">
              Abrir caso
            </Link>
            <Link className="btn" to="/how-it-works">
              Manual do agente
            </Link>
          </div>

          <div className="heroGrid">
            <div className="card">
              <div className="cardStep">01 — Abertura</div>
              <h2 className="cardTitle">Caso registrado</h2>
              <div className="cardText">
                A IA mantém uma identidade oculta. Você abre o caso sem saber
                quem é o suspeito.
              </div>
            </div>
            <div className="card">
              <div className="cardStep">02 — Interrogação</div>
              <h2 className="cardTitle">Evidências coletadas</h2>
              <div className="cardText">
                Faça perguntas fechadas. Sim confirma, Não descarta, Talvez
                restringe o cerco.
              </div>
            </div>
            <div className="card">
              <div className="cardStep">03 — Encerramento</div>
              <h2 className="cardTitle">Dossiê revelado</h2>
              <div className="cardText">
                Quando a identidade for certa, confronte pelo nome. O dossiê
                completo é aberto.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
