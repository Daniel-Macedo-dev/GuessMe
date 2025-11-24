import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function VictoryModal({ show, onClose, onPlayAgain, winner }) {
  if (!winner) return null;

  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Body className="p-4">
        <div className="card shadow-sm p-3 text-center">
          <h2 className="mb-3">🎉 Você Venceu!</h2>

          {winner.imagem && (
            <img
              src={winner.imagem}
              alt={winner.nome}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "260px", objectFit: "cover", marginBottom: "15px" }}
            />
          )}

          <h4 className="fw-bold">{winner.nome}</h4>

          {winner.obra && (
            <p className="text-muted mt-1">
              <strong>Obra:</strong> {winner.obra}
            </p>
          )}

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="secondary" onClick={onClose}>
              Fechar
            </Button>

            <Button variant="success" onClick={onPlayAgain}>
              Jogar Novamente
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
