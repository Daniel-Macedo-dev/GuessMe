export default function VictoryModal({ show, onClose, onPlayAgain, character }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">🎉 Você venceu!</h2>
        <p className="modal-text">Parabéns! Você descobriu o personagem da IA.</p>
        {character && (
          <div className="mb-3">
            <img src={character.image} alt={character.name} style={{ maxWidth: 120, borderRadius: 8 }} />
            <h5 className="mt-2">{character.name}</h5>
            <p className="text-muted">{character.origin}</p>
          </div>
        )}
        <div className="modal-buttons">
          <button className="btn btn-success" onClick={onPlayAgain}>Jogar novamente</button>
          <button className="btn btn-outline-light" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
