import type { WinnerData } from "../types/guessme";

type Props = { winner: WinnerData };

export default function PersonagemCard({ winner }: Props) {
  return (
    <div className="victoryCard">
      <div className="victoryAvatarWrap">
        {winner.image ? (
          <img className="victoryAvatar" src={winner.image} alt={winner.name} />
        ) : (
          <div className="victoryAvatar victoryAvatarFallback" aria-hidden="true">?</div>
        )}
      </div>

      <div className="victoryMeta">
        <div className="victoryName">{winner.name}</div>
        <div className="victoryWork">{winner.work}</div>
      </div>
    </div>
  );
}
