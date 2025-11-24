import { Modal, Button } from "react-bootstrap";

export default function VictoryModal({ show, onClose, onPlayAgain, winner }) {
  if (!winner) return null;

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <div
        className="p-4 text-center"
        style={{
          background: "#0d1117",
          color: "white",
          borderRadius: "12px",
        }}
      >
        <h2 className="fw-bold mb-3" style={{ fontSize: "2rem", color: "#58a6ff" }}>
          🎉 Você Venceu!
        </h2>

        <h3 className="fw-semibold mb-3">{winner?.name}</h3>

        {winner?.image && (
          <div
            style={{
              width: "100%",
              aspectRatio: "3 / 4",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "15px",
              border: "2px solid #30363d",
              background: "#000",
            }}
          >
            <img
              src={winner.image}
              alt={winner.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <p className="mb-4" style={{ fontSize: "1.2rem", opacity: 0.9 }}>
          Obra: <span className="fw-bold">{winner?.origin}</span>
        </p>

        <div className="d-flex justify-content-center gap-3">
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
