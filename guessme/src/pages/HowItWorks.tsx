import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HowItWorks() {
  return (
    <div className="shell">
      <Navbar />

      <main className="main">
        <section className="panel pagePanel">
          <div className="protocolHeader">
            <span className="protocolClassLabel">DOSSIÊ OPERACIONAL · ACESSO RESTRITO</span>
            <h2 className="h2">Manual do Agente</h2>
            <p className="muted pageLead">Cinco etapas para fechar qualquer caso.</p>
          </div>

          <div className="divider" />

          <div className="manualSteps">
            <div className="manualStep">
              <div className="stepNumber">01</div>
              <div className="stepContent">
                <h3 className="stepTitle">Abrir o caso</h3>
                <p className="muted">
                  Escolha um domínio — Anime, Games, Filmes ou Geral. A IA sorteia um
                  personagem e o caso começa imediatamente. Você não sabe a identidade.
                </p>
              </div>
            </div>

            <div className="manualStep">
              <div className="stepNumber">02</div>
              <div className="stepContent">
                <h3 className="stepTitle">Formular perguntas</h3>
                <p className="muted">
                  Faça perguntas que aceitem Sim ou Não. Comece amplo: "É humano?",
                  "É de anime?". Depois estreite: "É villain?", "Tem poderes?".
                </p>
              </div>
            </div>

            <div className="manualStep">
              <div className="stepNumber">03</div>
              <div className="stepContent">
                <h3 className="stepTitle">Ler as evidências</h3>
                <div className="evidenceLegend">
                  <span className="evidenceTag evidenceSim">Sim — confirmado</span>
                  <span className="evidenceTag evidenceNao">Não — descartado</span>
                  <span className="evidenceTag evidenceTalvez">Talvez — inconclusivo</span>
                </div>
                <p className="muted">
                  Cada resposta estreita o cerco. Acumule padrões antes de arriscar
                  uma hipótese.
                </p>
              </div>
            </div>

            <div className="manualStep">
              <div className="stepNumber">04</div>
              <div className="stepContent">
                <h3 className="stepTitle">Solicitar intel</h3>
                <p className="muted">
                  Se a investigação travar, peça uma pista. A pista revela uma
                  característica sem encerrar o caso — use com moderação.
                </p>
              </div>
            </div>

            <div className="manualStep">
              <div className="stepNumber">05</div>
              <div className="stepContent">
                <h3 className="stepTitle">Revelar o suspeito</h3>
                <p className="muted">
                  Quando tiver certeza, confronte pelo nome: "É o Naruto?". Se correto,
                  o caso é encerrado e o dossiê completo é revelado.
                </p>
              </div>
            </div>
          </div>

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
