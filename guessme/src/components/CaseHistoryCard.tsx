import { memo, useEffect, useRef, useState } from "react";
import type { CaseHistoryEntry } from "../types/guessme";
import DossierIcon from "./DossierIcon";

type Props = {
  entry: CaseHistoryEntry;
  onReplay: (entry: CaseHistoryEntry) => void;
  onDelete: (id: string) => void;
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CaseHistoryCard({ entry, onReplay, onDelete }: Props) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const confirmDeleteRef = useRef<HTMLButtonElement>(null);
  const { confirmed, refuted, inconclusive } = entry.evidence;

  useEffect(() => {
    if (confirmingDelete) confirmDeleteRef.current?.focus();
  }, [confirmingDelete]);

  return (
    <article className="historyCard" data-testid="history-card">
      <div className="historyCardHeader">
        <div className="historyCardMeta">
          <span className="historyCardName" data-testid="history-card-name">
            {entry.characterName}
          </span>
          <span className="historyCardWork muted small" data-testid="history-card-work">
            {entry.work}
          </span>
        </div>
        <span className="historyCardCategory caseLabel">{entry.category}</span>
      </div>

      <div className="historyCardStats">
        <span className="historyStat" data-testid="history-card-questions">
          <span className="historyStatValue">{entry.questionCount}</span>
          <span className="historyStatLabel muted small">perguntas</span>
        </span>
        <span className="historyStat">
          <span className="historyStatValue">{confirmed.length}</span>
          <span className="historyStatLabel muted small">confirmadas</span>
        </span>
        <span className="historyStat">
          <span className="historyStatValue">{refuted.length}</span>
          <span className="historyStatLabel muted small">refutadas</span>
        </span>
        <span className="historyStat">
          <span className="historyStatValue">{inconclusive.length}</span>
          <span className="historyStatLabel muted small">inconclusivas</span>
        </span>
        <span className="historyStat">
          <span className="historyStatValue">{entry.hintCount}</span>
          <span className="historyStatLabel muted small">pistas</span>
        </span>
      </div>

      {entry.winningQuestion && (
        <p className="historyCardWinning" title={entry.winningQuestion}>
          <span>PERGUNTA DECISIVA</span> “{entry.winningQuestion}”
        </p>
      )}

      <div className="historyCardFiling muted small">
        <span className="historyCardRef" aria-hidden="true">
          REF {entry.id.slice(-6).toUpperCase()}
        </span>
        <span className="historyCardDate">{formatDate(entry.createdAt)}</span>
      </div>

      <div className="historyCardActions">
        <button
          className="btn btn-primary historyActionBtn historyReplayBtn"
          onClick={() => onReplay(entry)}
          data-testid="history-replay-btn"
          aria-label={`Rever caso: ${entry.characterName}`}
        >
          <DossierIcon name="replay" size={13} aria-hidden={true} />
          Rever caso
        </button>
        {confirmingDelete ? (
          <div className="historyDeleteConfirm" role="group" aria-label={`Confirmar exclusão de ${entry.characterName}`}>
            <span className="historyDeletePrompt" role="status">Excluir este registro?</span>
            <button ref={confirmDeleteRef} className="btn historyActionBtn historyDeleteBtn" onClick={() => onDelete(entry.id)} data-testid="history-delete-confirm-btn">
              Confirmar
            </button>
            <button className="btn historyActionBtn" onClick={() => setConfirmingDelete(false)}>
              Cancelar
            </button>
          </div>
        ) : (
          <button
            className="btn historyActionBtn historyDeleteBtn"
            onClick={() => setConfirmingDelete(true)}
            data-testid="history-delete-btn"
            aria-label={`Excluir caso: ${entry.characterName}`}
          >
            Excluir
          </button>
        )}
      </div>
    </article>
  );
}

export default memo(CaseHistoryCard);
