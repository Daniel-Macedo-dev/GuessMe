import { useEffect, useRef } from "react";
import type { WinnerData } from "../types/guessme";
import PersonagemCard from "./PersonagemCard";
import DossierIcon from "./DossierIcon";

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
  const restartBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    restartBtnRef.current?.focus();

    return () => {
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
      <ConfettiBurst active={open} />

      <div className="modal victoryModal">
        <div className="victoryReportLabel" aria-hidden="true">RELATÓRIO DE CASO · ENCERRADO</div>

        <div className="victoryHeader">
          <div id="victory-dialog-title" className="caseSolvedStamp">Caso Encerrado</div>
          <p className="muted victorySubtitle">Identidade confirmada:</p>
        </div>

        <div className="victoryDivider" aria-hidden="true" />

        <PersonagemCard winner={winner} />

        <div className="victoryActions">
          <button ref={restartBtnRef} className="btn btn-primary" onClick={onRestart}>
            <DossierIcon name="case-file" size={13} aria-hidden={true} />
            Novo caso
          </button>
        </div>
      </div>
    </div>
  );
}
