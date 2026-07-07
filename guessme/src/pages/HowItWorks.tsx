import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DossierIcon from "../components/DossierIcon";
import ProtocolRouteMap from "../components/ProtocolRouteMap";

export default function HowItWorks() {
  return (
    <div className="shell">
      <Navbar />

      <main className="main">
        <section className="panel pagePanel">
          <div className="protocolHeader">
            <div className="dossierEyebrow protocolEyebrow" aria-hidden="true">
              <span>DOSSIÊ OPERACIONAL</span>
              <span className="dossierEyebrowDot" />
              <span>ACESSO RESTRITO</span>
            </div>
            <div className="protocolHeaderTitle">
              <span className="caseStamp caseStamp--classified caseStamp--sm">Manual do Agente</span>
              <h1 className="h2">Protocolo de Interrogação</h1>
            </div>
            <p className="muted pageLead">Cinco etapas para fechar qualquer caso.</p>
            <div className="protocolRouteWrap">
              <ProtocolRouteMap />
            </div>
          </div>

          <div className="divider" />

          <div className="manualSteps">
            <div className="manualStep">
              <div className="manualStepIcon manualStepIcon--green" aria-hidden="true">
                <DossierIcon name="case-file" size={16} aria-hidden={true} />
              </div>
              <div className="stepContent">
                <span className="manualStepIndex">Etapa 01 / 05</span>
                <h2 className="stepTitle">Abrir o caso</h2>
                <p className="muted">
                  Escolha um domínio — Anime, Games, Filmes ou Geral. A IA sorteia um
                  personagem e o caso começa imediatamente. Você não sabe a identidade.
                </p>
              </div>
            </div>

            <div className="manualStep">
              <div className="manualStepIcon manualStepIcon--amber" aria-hidden="true">
                <DossierIcon name="magnifier" size={16} aria-hidden={true} />
              </div>
              <div className="stepContent">
                <span className="manualStepIndex">Etapa 02 / 05</span>
                <h2 className="stepTitle">Formular perguntas</h2>
                <p className="muted">
                  Faça perguntas que aceitem Sim ou Não. Comece amplo: "É humano?",
                  "É de anime?". Depois estreite: "É villain?", "Tem poderes?".
                </p>
              </div>
            </div>

            <div className="manualStep">
              <div className="manualStepIcon manualStepIcon--green" aria-hidden="true">
                <DossierIcon name="evidence" size={16} aria-hidden={true} />
              </div>
              <div className="stepContent">
                <span className="manualStepIndex">Etapa 03 / 05</span>
                <h2 className="stepTitle">Ler as evidências</h2>
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
              <div className="manualStepIcon manualStepIcon--cyan" aria-hidden="true">
                <DossierIcon name="clue" size={16} aria-hidden={true} />
              </div>
              <div className="stepContent">
                <span className="manualStepIndex">Etapa 04 / 05</span>
                <h2 className="stepTitle">Solicitar intel</h2>
                <p className="muted">
                  Se a investigação travar, peça uma pista. A pista revela uma
                  característica sem encerrar o caso — use com moderação.
                </p>
              </div>
            </div>

            <div className="manualStep">
              <div className="manualStepIcon manualStepIcon--red" aria-hidden="true">
                <DossierIcon name="lock" size={16} aria-hidden={true} />
              </div>
              <div className="stepContent">
                <span className="manualStepIndex">Etapa 05 / 05</span>
                <h2 className="stepTitle">Revelar o suspeito</h2>
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

          <div className="dossierEyebrow manualPageFooter" aria-hidden="true">
            <span>MANUAL DO AGENTE</span>
            <span className="dossierEyebrowDot" />
            <span>PROTOCOLO IA-1</span>
            <span className="dossierEyebrowDot" />
            <span>PÁGINA 01 / 01</span>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
