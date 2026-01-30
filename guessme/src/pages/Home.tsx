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

          <h1 className="heroTitle">Adivinhe o personagem</h1>

          <p className="heroText">
            Faça perguntas de <b>sim/não</b>, receba respostas da IA e tente
            descobrir quem é o personagem secreto.
          </p>

          <div className="heroActions">
            <Link className="btn btn-primary" to="/game">
              Jogar agora
            </Link>
            <Link className="btn" to="/how-it-works">
              Como funciona
            </Link>
          </div>

          <div className="heroGrid">
            <div className="card">
              <div className="cardTitle">Perguntas rápidas</div>
              <div className="cardText">
                Comece amplo e vá afunilando até ter certeza.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Respostas naturais</div>
              <div className="cardText">
                A IA ajuda sem entregar spoiler direto.
              </div>
            </div>
            <div className="card">
              <div className="cardTitle">Vitória com card</div>
              <div className="cardText">
                Ao acertar, você vê personagem, obra e imagem.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
