import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseEvidenceEntry, CaseHistoryEntry, CaseIntelEntry } from "../types/guessme";
import MessageBubble from "./MessageBubble";
import {
  buildCaseExportFilename,
  createCaseExportPayload,
  formatCaseAsMarkdown,
} from "../helpers/caseExport";
import { createCaseShareSvg } from "../helpers/caseShareCard";
import {
  copyTextToClipboard,
  downloadJsonFile,
  downloadSvgFile,
} from "../services/caseExportService";

type Props = {
  entry: CaseHistoryEntry;
  onClose: () => void;
};

type ActionStatus = "idle" | "success" | "error";

function EvidenceSection({
  title,
  items,
  testId,
  colorClass,
  verdictClass,
  verdictLabel,
}: {
  title: string;
  items: CaseEvidenceEntry[];
  testId: string;
  colorClass: string;
  verdictClass: string;
  verdictLabel: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={`nbSection ${colorClass}`} data-testid={testId}>
      <h4 className="nbSectionTitle">
        <span>{title}</span>
        <span className="nbCount">{items.length}</span>
      </h4>
      <ul className="nbList" aria-label={title}>
        {items.map((e) => (
          <li key={e.id} className="nbEntry">
            <span className={`nbVerdict ${verdictClass}`}>{verdictLabel}</span>
            <span className="nbQuestion">{e.question}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IntelSection({ hints }: { hints: CaseIntelEntry[] }) {
  if (hints.length === 0) return null;
  return (
    <div className="nbSection nbSectionIntel" data-testid="replay-evidence-intel">
      <h4 className="nbSectionTitle">
        <span>Inteligência</span>
        <span className="nbCount">{hints.length}</span>
      </h4>
      <ul className="nbList" aria-label="Inteligência">
        {hints.map((h) => (
          <li key={h.id} className="nbEntry nbEntryIntel">
            <span className="nbVerdict nbVerdictIntel">Pista</span>
            <span className="nbQuestion">{h.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const STATUS_LABELS: Record<string, { success: string; error: string }> = {
  copy: { success: "Resumo copiado!", error: "Falha ao copiar — tente novamente." },
  json: { success: "JSON baixado!", error: "Falha ao baixar JSON." },
  svg: { success: "Card baixado!", error: "Falha ao baixar card." },
};

export default function CaseReplayModal({ entry, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [copyStatus, setCopyStatus] = useState<ActionStatus>("idle");
  const [jsonStatus, setJsonStatus] = useState<ActionStatus>("idle");
  const [svgStatus, setSvgStatus] = useState<ActionStatus>("idle");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    };
  }, []);

  const setStatus = useCallback(
    (setter: (s: ActionStatus) => void, status: ActionStatus) => {
      setter(status);
      if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
      statusTimerRef.current = setTimeout(() => {
        setCopyStatus("idle");
        setJsonStatus("idle");
        setSvgStatus("idle");
      }, 3000);
    },
    [],
  );

  const handleCopy = useCallback(async () => {
    try {
      const text = formatCaseAsMarkdown(entry);
      await copyTextToClipboard(text);
      setStatus(setCopyStatus, "success");
    } catch {
      setStatus(setCopyStatus, "error");
    }
  }, [entry, setStatus]);

  const handleDownloadJson = useCallback(() => {
    try {
      const payload = createCaseExportPayload(entry);
      const filename = buildCaseExportFilename(entry, "json");
      downloadJsonFile(filename, payload);
      setStatus(setJsonStatus, "success");
    } catch {
      setStatus(setJsonStatus, "error");
    }
  }, [entry, setStatus]);

  const handleDownloadSvg = useCallback(() => {
    try {
      const svg = createCaseShareSvg(entry);
      const filename = buildCaseExportFilename(entry, "svg");
      downloadSvgFile(filename, svg);
      setStatus(setSvgStatus, "success");
    } catch {
      setStatus(setSvgStatus, "error");
    }
  }, [entry, setStatus]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  const { confirmed, refuted, inconclusive, hints } = entry.evidence;
  const hasEvidence =
    confirmed.length + refuted.length + inconclusive.length + hints.length > 0;

  const anyStatus =
    copyStatus !== "idle"
      ? copyStatus === "success"
        ? STATUS_LABELS.copy.success
        : STATUS_LABELS.copy.error
      : jsonStatus !== "idle"
        ? jsonStatus === "success"
          ? STATUS_LABELS.json.success
          : STATUS_LABELS.json.error
        : svgStatus !== "idle"
          ? svgStatus === "success"
            ? STATUS_LABELS.svg.success
            : STATUS_LABELS.svg.error
          : null;

  const statusIsError =
    copyStatus === "error" || jsonStatus === "error" || svgStatus === "error";

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="replay-dialog-title"
      data-testid="replay-modal"
      onKeyDown={handleKeyDown}
    >
      <div className="modal replayModal" ref={modalRef}>
        <div className="replayClassLabel" aria-hidden="true">DOSSIÊ ARQUIVADO · ACESSO RESTRITO</div>

        <div className="replayHeader">
          <div>
            <div id="replay-dialog-title" className="caseSolvedStamp replayStamp">
              Caso Arquivado
            </div>
            <p className="replayCharacter" data-testid="replay-character">
              {entry.characterName}
            </p>
            {entry.work && (
              <p className="muted small replayWork">{entry.work} · {entry.category}</p>
            )}
          </div>
          <button
            ref={closeBtnRef}
            className="btn replayCloseBtn"
            onClick={onClose}
            aria-label="Fechar replay"
            data-testid="replay-close-btn"
          >
            ✕
          </button>
        </div>

        {entry.winningQuestion && (
          <div className="replayWinningQuestion" data-testid="replay-winning-question">
            <span className="caseLabel">Pergunta decisiva</span>
            <p className="replayWinningText">{entry.winningQuestion}</p>
          </div>
        )}

        <div className="replayStats">
          <span className="replayStat">
            <span className="historyStatValue">{entry.questionCount}</span>
            <span className="muted small"> perguntas</span>
          </span>
          <span className="replayStat">
            <span className="historyStatValue">{entry.hintCount}</span>
            <span className="muted small"> pistas</span>
          </span>
          <span className="replayStat">
            <span className="historyStatValue">{entry.verdictStats.yes}</span>
            <span className="muted small"> confirmadas</span>
          </span>
          <span className="replayStat">
            <span className="historyStatValue">{entry.verdictStats.no}</span>
            <span className="muted small"> refutadas</span>
          </span>
        </div>

        <div className="replayBody">
          <div className="replayTimeline" data-testid="replay-timeline">
            <div className="replayDossierLabel" aria-hidden="true">TRANSCRIÇÃO</div>
            <h4 className="replaySectionTitle">Sequência de perguntas</h4>
            <div className="replayChat" role="log" aria-label="Sequência de perguntas e respostas" aria-readonly="true">
              {entry.messages.map((m) => (
                <MessageBubble key={m.id} sender={m.sender} text={m.text} kind={m.kind} verdict={m.verdict} />
              ))}
            </div>
          </div>

          {hasEvidence && (
            <div className="replayEvidence" data-testid="replay-evidence-snapshot">
              <div className="replayDossierLabel" aria-hidden="true">EVIDÊNCIAS</div>
              <h4 className="replaySectionTitle">Evidências</h4>
              <EvidenceSection
                title="Confirmado"
                items={confirmed}
                testId="replay-evidence-confirmed"
                colorClass="nbSectionSim"
                verdictClass="nbVerdictSim"
                verdictLabel="Sim"
              />
              <EvidenceSection
                title="Refutado"
                items={refuted}
                testId="replay-evidence-refuted"
                colorClass="nbSectionNao"
                verdictClass="nbVerdictNao"
                verdictLabel="Não"
              />
              <EvidenceSection
                title="Inconclusivo"
                items={inconclusive}
                testId="replay-evidence-inconclusive"
                colorClass="nbSectionTalvez"
                verdictClass="nbVerdictTalvez"
                verdictLabel="Talvez"
              />
              <IntelSection hints={hints} />
            </div>
          )}
        </div>

        <div className="replayFooter">
          <div className="replayExportActions" data-testid="replay-export-actions">
            <button
              className="btn replayExportBtn"
              onClick={handleCopy}
              data-testid="replay-copy-btn"
              aria-label="Copiar resumo do caso como Markdown"
            >
              Copiar resumo
            </button>
            <button
              className="btn replayExportBtn"
              onClick={handleDownloadJson}
              data-testid="replay-download-json-btn"
              aria-label="Baixar caso como arquivo JSON"
            >
              Baixar JSON
            </button>
            <button
              className="btn replayExportBtn"
              onClick={handleDownloadSvg}
              data-testid="replay-download-svg-btn"
              aria-label="Baixar card visual do caso"
            >
              Baixar card
            </button>
          </div>
          <button className="btn btn-primary" onClick={onClose}>
            Fechar
          </button>
        </div>

        {anyStatus && (
          <div
            className={`replayExportStatus ${statusIsError ? "replayExportStatusError" : "replayExportStatusOk"}`}
            role="status"
            aria-live="polite"
            data-testid="replay-export-status"
          >
            {anyStatus}
          </div>
        )}
      </div>
    </div>
  );
}
