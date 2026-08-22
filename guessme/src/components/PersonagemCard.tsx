import { useState } from "react";
import type { WinnerData } from "../types/guessme";

type Props = { winner: WinnerData };

export default function PersonagemCard({ winner }: Props) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const showImage = Boolean(winner.image) && failedImage !== winner.image;

  return (
    <div className="victoryCard">
      <div className="victoryAvatarWrap">
        {showImage ? (
          <img
            className="victoryAvatar"
            src={winner.image}
            alt={`Retrato de ${winner.name}`}
            onError={() => setFailedImage(winner.image)}
          />
        ) : (
          <div className="victoryAvatarFallback" role="img" aria-label={`Retrato indisponível para ${winner.name}`}>
            <span aria-hidden="true">?</span>
          </div>
        )}
      </div>

      <div className="victoryMeta">
        <div className="victoryName">{winner.name}</div>
        <div className="victoryWork">{winner.work}</div>
      </div>
    </div>
  );
}
