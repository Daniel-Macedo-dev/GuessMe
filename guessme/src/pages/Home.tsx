import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BrandMark from "../components/BrandMark";
import DossierIcon from "../components/DossierIcon";

export default function Home() {
  return (
    <div className="shell">
      <Navbar />
      <main className="main mainCenter">
        <section className="panel hero">

          <div className="heroClassification" aria-hidden="true">
            <span className="heroClassLabel">CONFIDENCIAL</span>
            <span className="heroClassDot" />
            <span className="heroClassLabel">PROTOCOLO DE INTERROGAÇÃO</span>
            <span className="heroClassDot" />
            <span className="heroClassLabel">IA-1</span>
          </div>

          <div className="heroSealRow">
            <BrandMark size={52} className="heroSealMark" />
          </div>

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

          <div className="heroMeta" aria-hidden="true">
            <span>SISTEMA v2</span>
            <span className="heroMetaDot">·</span>
            <span>DOSSIÊ DIGITAL</span>
            <span className="heroMetaDot">·</span>
            <span>ANÁLISE LOCAL</span>
          </div>

          <div className="heroGrid">
            <div className="card heroProtocolCard">
              <div className="heroProtocolNum" aria-hidden="true">01</div>
              <div className="stepIconWrap stepIconWrap--green" aria-hidden="true">
                <DossierIcon name="case-file" size={18} aria-hidden={true} />
              </div>
              <div className="cardStep">Abertura</div>
              <h2 className="cardTitle">Caso registrado</h2>
              <div className="cardText">
                A IA mantém uma identidade oculta. Você abre o caso sem saber
                quem é o suspeito.
              </div>
            </div>
            <div className="card heroProtocolCard">
              <div className="heroProtocolNum" aria-hidden="true">02</div>
              <div className="stepIconWrap stepIconWrap--amber" aria-hidden="true">
                <DossierIcon name="magnifier" size={18} aria-hidden={true} />
              </div>
              <div className="cardStep">Interrogação</div>
              <h2 className="cardTitle">Evidências coletadas</h2>
              <div className="cardText">
                Faça perguntas fechadas. Sim confirma, Não descarta, Talvez
                restringe o cerco.
              </div>
            </div>
            <div className="card heroProtocolCard">
              <div className="heroProtocolNum" aria-hidden="true">03</div>
              <div className="stepIconWrap stepIconWrap--slate" aria-hidden="true">
                <DossierIcon name="archive" size={18} aria-hidden={true} />
              </div>
              <div className="cardStep">Encerramento</div>
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
