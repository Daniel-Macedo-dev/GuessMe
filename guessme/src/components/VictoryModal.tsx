import { useEffect, useState } from "react";
import type { WinnerData } from "../types/guessme";
import PersonagemCard from "./PersonagemCard";

type Props = {
  winner: WinnerData | null;
  onRestart: () => void;
};

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="confettiPiece" />
      ))}
    </div>
  );
}

export default function VictoryModal({ winner, onRestart }: Props) {
  const open = !!winner;
  const [confettiOn, setConfettiOn] = useState(false);

  useEffect(() => {
    if (!open) return;

    setConfettiOn(true);
    const t = window.setTimeout(() => setConfettiOn(false), 1400);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !winner) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <ConfettiBurst active={confettiOn} />

      <div className="modal victoryModal">
        <div className="victoryHeader">
          <h3 className="h3 victoryTitle">Você venceu! 🎉</h3>
          <p className="muted victorySubtitle">O personagem era:</p>
        </div>

        <PersonagemCard winner={winner} />

        <div className="victoryActions">
          <button className="btn btn-primary" onClick={onRestart}>
            Jogar de novo
          </button>
        </div>
      </div>
    </div>
  );
}
