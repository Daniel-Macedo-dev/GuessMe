import { useNavigate } from "react-router-dom";

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="panel" style={{ maxWidth: 980, margin: "0 auto" }}>
      <div className="panelHeader">
        <div style={{ fontWeight: 1000 }}>Como funciona</div>
        <button className="btn" onClick={() => navigate("/game")}>
          Ir para o jogo
        </button>
      </div>

      <div className="panelBody">
        <p className="muted" style={{ marginTop: 0, lineHeight: 1.6 }}>
          A IA escolhe um personagem e você tenta descobrir fazendo perguntas que retornam{" "}
          <b>Sim</b>, <b>Não</b> ou <b>Talvez</b>.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 12,
            marginTop: 14,
          }}
          className="howGrid"
        >
          <div className="sideCard">
            <div className="h3">1) A IA escolhe</div>
            <div className="muted" style={{ lineHeight: 1.6 }}>
              Um personagem de uma obra (filme, série, anime, jogo etc.).
            </div>
          </div>

          <div className="sideCard">
            <div className="h3">2) Você pergunta</div>
            <div className="muted" style={{ lineHeight: 1.6 }}>
              Perguntas objetivas, sem texto longo. Ex: “É humano?”
            </div>
          </div>

          <div className="sideCard">
            <div className="h3">3) Você vence</div>
            <div className="muted" style={{ lineHeight: 1.6 }}>
              Ao acertar, aparece um card com <b>nome</b>, <b>obra</b> e (quando existir) <b>imagem</b>.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontWeight: 950, marginBottom: 6 }}>Sugestões de perguntas</div>
          <ul className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>É real ou fictício?</li>
            <li>É humano?</li>
            <li>É de filme/série/anime/jogo?</li>
            <li>É protagonista?</li>
            <li>Tem poderes?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
