import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">🎮 GuessMe</h1>
      <p className="lead">Tente adivinhar o personagem que a IA está pensando!</p>

      <Link to="/game" className="btn btn-primary btn-lg mt-3">
        Iniciar Jogo
      </Link>
    </div>
  );
}
