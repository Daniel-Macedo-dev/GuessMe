import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page-center">
      <div className="card dark-card hero-card">
        <h1 className="title">🎮 GuessMe</h1>
        <p className="lead">Tente adivinhar o personagem que a IA está pensando!</p>
        <Link to="/game" className="btn btn-primary btn-lg mt-3">
          Iniciar Jogo
        </Link>
      </div>
    </div>
  );
}
