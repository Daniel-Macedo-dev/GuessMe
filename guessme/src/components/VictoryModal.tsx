import { useEffect, useMemo, useState } from "react";
import type { WinnerData } from "../types/guessme";

type Props = {
  show: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  winner: WinnerData | null;
};

type ConfettiPiece = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  rotate: number;
};

export default function VictoryModal({ show, onClose, onPlayAgain, winner }: Props) {
  const [burstKey, setBurstKey] = useState(0);

  useEffect(() => {
    if (show) setBurstKey((k) => k + 1);
  }, [show]);

  const confetti = useMemo<ConfettiPiece[]>(() => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 46; i++) {
      pieces.push({
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        duration: 1.6 + Math.random() * 1.0,
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
      });
    }
    return pieces;
  }, [burstKey]);

  if (!show || !winner) return null;

  const hasImage = !!winner.image && winner.image.trim().length > 0;

  const searchUrl =
    "https://www.google.com/search?tbm=isch&q=" +
    encodeURIComponent(`${winner.name} ${winner.work} character official portrait`);

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      {/* Confetti */}
      <div className="confettiLayer" aria-hidden="true">
        {confetti.map((p, i) => (
          <span
            key={i}
            className="confettiPiece"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size * 0.55}px`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="modal">
        <div className="modalHead">
          <div style={{ fontWeight: 1000 }}>🎉 Você venceu!</div>
          <button className="btn" onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className="modalBody" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 1000 }}>{winner.name}</div>
          <div className="muted" style={{ marginTop: 6 }}>
            Obra: <b style={{ color: "rgba(255,255,255,0.90)" }}>{winner.work}</b>
          </div>

          <div style={{ marginTop: 14, display: "grid", placeItems: "center" }}>
            {hasImage ? (
              <img className="heroImg" src={winner.image} alt={winner.name} loading="lazy" />
            ) : (
              <div className="sideCard" style={{ maxWidth: 360 }}>
                <div style={{ fontWeight: 950, marginBottom: 6 }}>Sem imagem encontrada</div>
                <a href={searchUrl} target="_blank" rel="noreferrer" className="muted">
                  Buscar no Google Imagens
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="modalActions">
          <button className="btn btn-primary" onClick={onPlayAgain}>
            Jogar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
