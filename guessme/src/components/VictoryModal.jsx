import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function VictoryModal({ show, onClose, onPlayAgain, winner }) {
  if (!winner) return null;

  return (
    <Modal show={show} centered>
      <div className="p-4 text-center" style={{ background: "#1c1c1c", color: "#fff" }}>
        <h2 className="mb-3">🎉 Você Venceu!</h2>

        {winner.imagem && (
          <img
            src={winner.imagem}
            alt={winner.nome}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "250px", marginBottom: "15px" }}
          />
        )}

        <h4 className="mt-2">{winner.nome}</h4>

        {winner.obra && <p className="text-muted">Obra: {winner.obra}</p>}

        <div className="d-flex justify-content-center gap-3 mt-4">
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
