import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 140px)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div className="panel" style={{ maxWidth: 820, width: "100%" }}>
        <div className="panelHeader">
          <div style={{ fontWeight: 1000 }}>GuessMe</div>
          <span className="pill">React + Vite</span>
        </div>

        <div className="panelBody" style={{ textAlign: "center", padding: "26px 18px" }}>
          <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 10 }}>🎮</div>

          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 1000, letterSpacing: 0.2 }}>
            Adivinhe o personagem que a IA escolheu
          </h1>

          <p className="muted" style={{ margin: "12px auto 0", maxWidth: 680, lineHeight: 1.6 }}>
            Faça perguntas que só podem ser respondidas com <b>Sim</b>, <b>Não</b> ou <b>Talvez</b> até
            acertar.
          </p>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
            <button className="btn btn-primary" onClick={() => navigate("/game")}>
              Jogar agora
            </button>
          </div>

          <div className="muted" style={{ marginTop: 12, fontSize: 13 }}>
            Quer entender as regras?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/how-it-works");
              }}
            >
              Ver “Como funciona”
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
