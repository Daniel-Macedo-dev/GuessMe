export default function VictoryModal({ show, onClose, onPlayAgain }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-victory card p-4">
        <h3>🎉 Parabéns!</h3>
        <p className="mb-3">Você acertou o personagem!</p>
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-primary" onClick={() => { onPlayAgain(); }}>
            Jogar Novamente
          </button>
          <button className="btn btn-outline-light" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
