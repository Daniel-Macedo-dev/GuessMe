import { Modal, Button } from "react-bootstrap";
import type { WinnerData } from "../types/guessme";

type Props = {
  show: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  winner: WinnerData | null;
};

export default function VictoryModal({ show, onClose, onPlayAgain, winner }: Props) {
  if (!show || !winner) return null;

  const searchUrl =
    "https://www.google.com/search?tbm=isch&q=" +
    encodeURIComponent(`${winner.name} ${winner.work} character official portrait`);

  const hasImage = !!winner.image && winner.image.trim().length > 0;

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <div className="victory-modal p-4 text-center">
        <h2 className="victory-title">
          🎉 Você Venceu!
        </h2>

        <h3 className="victory-name">{winner.name}</h3>

        <p className="victory-work">
          Obra: <span className="fw-bold">{winner.work}</span>
        </p>

        <div className="victory-media">
          {hasImage ? (
            <img
              src={winner.image}
              alt={winner.name}
              className="victory-img"
              loading="lazy"
            />
          ) : (
            <div className="victory-img-fallback">
              <div className="fallback-title">Sem imagem encontrada</div>
              <a className="fallback-link" href={searchUrl} target="_blank" rel="noreferrer">
                Buscar no Google Imagens
              </a>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center gap-3 mt-3">
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="success" onClick={onPlayAgain}>
            Jogar Novamente
          </Button>
        </div>
      </div>
    </Modal>
  );
}
