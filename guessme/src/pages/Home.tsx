import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="shell">
      <Navbar />
      <main className="main mainCenter">
        <section className="panel hero">
          <div className="heroBadge">GuessMe</div>

          <h1 className="heroTitle">Desvende a identidade</h1>

          <p className="heroText">
            Um personagem oculto. Um dossiê em branco. Use perguntas
            cirúrgicas para confirmar a identidade e fechar o caso.
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
              <h3 className="cardTitle">Interrogação</h3>
              <div className="cardText">
                Perguntas fechadas revelam padrões. Comece amplo e feche o cerco.
              </div>
            </div>
            <div className="card">
              <h3 className="cardTitle">Análise</h3>
              <div className="cardText">
                A IA responde sem revelar. Interprete cada resposta como evidência.
              </div>
            </div>
            <div className="card">
              <h3 className="cardTitle">Caso encerrado</h3>
              <div className="cardText">
                Ao confirmar o suspeito, o dossiê é revelado com nome e obra.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
