import { memo } from "react";
import type { CaseHistoryEntry } from "../types/guessme";

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
  const { confirmed, refuted, inconclusive } = entry.evidence;

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
      </div>

      <div className="historyCardDate muted small">{formatDate(entry.createdAt)}</div>

      <div className="historyCardActions">
        <button
          className="btn btn-primary historyActionBtn"
          onClick={() => onReplay(entry)}
          data-testid="history-replay-btn"
          aria-label={`Rever caso: ${entry.characterName}`}
        >
          Rever caso
        </button>
        <button
          className="btn historyActionBtn historyDeleteBtn"
          onClick={() => onDelete(entry.id)}
          data-testid="history-delete-btn"
          aria-label={`Excluir caso: ${entry.characterName}`}
        >
          Excluir
        </button>
      </div>
    </article>
  );
}

export default memo(CaseHistoryCard);
