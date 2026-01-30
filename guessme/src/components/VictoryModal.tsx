import { useEffect } from "react";
import type { WinnerData } from "../types/guessme";
import PersonagemCard from "./PersonagemCard";

type Props = {
  winner: WinnerData | null;
  onRestart: () => void;
};

export default function VictoryModal({ winner, onRestart }: Props) {
  const open = !!winner;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !winner) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modalHeader">
          <h3 className="h3">Você venceu! 🎉</h3>
          <p className="muted">O personagem era:</p>
        </div>

        <PersonagemCard winner={winner} />

        <div className="row">
          <button className="btn btn-primary" onClick={onRestart}>
            Jogar de novo
          </button>
        </div>
      </div>
    </div>
  );
}
