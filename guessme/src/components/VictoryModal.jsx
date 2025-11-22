import React from "react";
import "./VictoryModal.css";

export default function VictoryModal({ show, onClose, onPlayAgain }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">🎉 Você venceu!</h2>
        <p className="modal-text">
          Parabéns! Você descobriu o personagem da IA.
        </p>
        <div className="modal-buttons">
          <button className="btn btn-success" onClick={onPlayAgain}>
            Jogar novamente
          </button>
          <button className="btn btn-outline-light" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
