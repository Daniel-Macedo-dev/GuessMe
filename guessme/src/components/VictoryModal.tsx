import { useEffect, useRef, useState } from "react";
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
  const restartBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const tStart = window.setTimeout(() => setConfettiOn(true), 0);
    const tStop = window.setTimeout(() => setConfettiOn(false), 1400);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    restartBtnRef.current?.focus();

    return () => {
      window.clearTimeout(tStart);
      window.clearTimeout(tStop);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !winner) return null;

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-dialog-title"
      onKeyDown={(e) => { if (e.key === "Escape") onRestart(); }}
    >
      <ConfettiBurst active={confettiOn} />

      <div className="modal victoryModal">
        <div className="victoryHeader">
          <div id="victory-dialog-title" className="caseSolvedStamp">Caso Encerrado</div>
          <p className="muted victorySubtitle">Identidade confirmada:</p>
        </div>

        <PersonagemCard winner={winner} />

        <div className="victoryActions">
          <button ref={restartBtnRef} className="btn btn-primary" onClick={onRestart}>
            Novo caso
          </button>
        </div>
      </div>
    </div>
  );
}
