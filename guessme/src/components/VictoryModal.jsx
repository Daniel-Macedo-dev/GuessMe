import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function VictoryModal({ show, onClose, onPlayAgain, winner }) {
  if (!winner) return null;

  return (
    <Modal show={show} centered backdrop="static">
      <Modal.Header closeButton style={{ background: "#1c1c1c", color: "#fff" }}>
        <Modal.Title>🎉 Você Venceu!</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ background: "#1c1c1c", color: "#fff" }}>
        <div
          className="card shadow-sm mx-auto"
          style={{
            width: "100%",
            maxWidth: "350px",
            background: "#242424",
            border: "1px solid #444",
            color: "#fff",
          }}
        >
          {winner.imagem && (
            <img
              src={winner.imagem}
              alt={winner.nome}
              className="card-img-top"
              style={{
                objectFit: "cover",
                maxHeight: "260px",
                borderBottom: "1px solid #444",
              }}
            />
          )}

          <div className="card-body text-center">
            <h4 className="card-title mb-2">{winner.nome}</h4>

            {winner.obra && (
              <p className="card-text" style={{ color: "#aaa" }}>
                Obra: {winner.obra}
              </p>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ background: "#1c1c1c", borderTop: "1px solid #333" }}>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>

        <Button variant="success" onClick={onPlayAgain}>
          Jogar Novamente
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
