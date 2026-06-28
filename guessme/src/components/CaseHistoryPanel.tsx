import { useState } from "react";
import type { CaseHistoryEntry } from "../types/guessme";
import CaseHistoryCard from "./CaseHistoryCard";
import CaseReplayModal from "./CaseReplayModal";

type Props = {
  history: CaseHistoryEntry[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
};

export default function CaseHistoryPanel({ history, onDelete, onClearAll }: Props) {
  const [replayEntry, setReplayEntry] = useState<CaseHistoryEntry | null>(null);

  return (
    <section
      className="historyPanel panel"
      aria-label="Histórico de Casos"
      data-testid="history-panel"
    >
      <div className="historyPanelHeader">
        <h3 className="historyPanelTitle">Histórico de Casos</h3>
        {history.length > 0 && (
          <button
            className="btn historyActionBtn historyDeleteBtn"
            onClick={onClearAll}
            data-testid="history-clear-btn"
            aria-label="Limpar histórico"
          >
            Limpar
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="historyEmpty" role="status" data-testid="history-empty">
          <p className="muted small">Nenhum caso arquivado ainda.</p>
        </div>
      ) : (
        <ul className="historyList" aria-label="Casos resolvidos">
          {history.map((entry) => (
            <li key={entry.id}>
              <CaseHistoryCard
                entry={entry}
                onReplay={setReplayEntry}
                onDelete={onDelete}
              />
            </li>
          ))}
        </ul>
      )}

      {replayEntry && (
        <CaseReplayModal
          entry={replayEntry}
          onClose={() => setReplayEntry(null)}
        />
      )}
    </section>
  );
}
