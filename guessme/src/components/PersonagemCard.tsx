import type { WinnerData } from "../types/guessme";

type Props = { winner: WinnerData };

export default function PersonagemCard({ winner }: Props) {
  return (
    <div className="characterCard">
      <div className="characterImgWrap">
        <img className="characterImg" src={winner.image} alt={winner.name} />
      </div>

      <div className="characterInfo">
        <div className="characterName">{winner.name}</div>
        <div className="muted">{winner.work}</div>
      </div>
    </div>
  );
}
