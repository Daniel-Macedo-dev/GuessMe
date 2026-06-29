import { useRef, useState } from "react";
import type { CaseHistoryEntry } from "../types/guessme";
import CaseHistoryCard from "./CaseHistoryCard";
import CaseReplayModal from "./CaseReplayModal";
import { parseCaseExportJson, CaseImportError } from "../helpers/caseImport";

type ImportStatus =
  | { kind: "idle" }
  | { kind: "success"; renamed: boolean }
  | { kind: "error"; message: string };

type Props = {
  history: CaseHistoryEntry[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onImport: (entry: CaseHistoryEntry) => { renamed: boolean };
};

export default function CaseHistoryPanel({
  history,
  onDelete,
  onClearAll,
  onImport,
}: Props) {
  const [replayEntry, setReplayEntry] = useState<CaseHistoryEntry | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({ kind: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function resetStatus() {
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => setImportStatus({ kind: "idle" }), 4000);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset value so the same file can be re-imported after an error
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = (evt) => {
      const raw = evt.target?.result;
      if (typeof raw !== "string") {
        setImportStatus({ kind: "error", message: "Não foi possível ler o arquivo." });
        resetStatus();
        return;
      }
      try {
        const entry = parseCaseExportJson(raw);
        const { renamed } = onImport(entry);
        setImportStatus({ kind: "success", renamed });
        resetStatus();
      } catch (err) {
        const msg =
          err instanceof CaseImportError
            ? err.message
            : "Erro inesperado ao importar o caso.";
        setImportStatus({ kind: "error", message: msg });
        resetStatus();
      }
    };
    reader.onerror = () => {
      setImportStatus({ kind: "error", message: "Falha ao ler o arquivo." });
      resetStatus();
    };
    reader.readAsText(file);
  }

  return (
    <section
      className="historyPanel panel"
      aria-label="Histórico de Casos"
      data-testid="history-panel"
    >
      <div className="historyPanelHeader">
        <h3 className="historyPanelTitle">Histórico de Casos</h3>
        <div className="historyPanelActions">
          <button
            className="btn historyActionBtn historyImportBtn"
            onClick={handleImportClick}
            data-testid="history-import-btn"
            aria-label="Importar caso a partir de arquivo JSON"
          >
            Importar caso
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="historyImportInput"
            aria-label="Selecionar arquivo JSON para importar"
            data-testid="history-import-input"
            onChange={handleFileChange}
          />
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
      </div>

      {importStatus.kind !== "idle" && (
        <div
          className={`historyImportStatus ${importStatus.kind === "error" ? "historyImportStatusError" : "historyImportStatusOk"}`}
          role="status"
          aria-live="polite"
          data-testid="history-import-status"
        >
          {importStatus.kind === "success"
            ? importStatus.renamed
              ? "Caso importado! O ID foi renomeado para evitar duplicatas."
              : "Caso importado com sucesso!"
            : importStatus.message}
        </div>
      )}

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
