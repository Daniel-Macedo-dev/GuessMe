import { useEffect, useRef } from "react";
import type { CaseEvidenceEntry, CaseHistoryEntry, CaseIntelEntry } from "../types/guessme";
import MessageBubble from "./MessageBubble";

type Props = {
  entry: CaseHistoryEntry;
  onClose: () => void;
};

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

export default function CaseReplayModal({ entry, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  const { confirmed, refuted, inconclusive, hints } = entry.evidence;
  const hasEvidence =
    confirmed.length + refuted.length + inconclusive.length + hints.length > 0;

  return (
    <div
      className="modalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="replay-dialog-title"
      data-testid="replay-modal"
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div className="modal replayModal">
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
            <h4 className="replaySectionTitle">Sequência de perguntas</h4>
            <div className="replayChat">
              {entry.messages.map((m) => (
                <MessageBubble key={m.id} sender={m.sender} text={m.text} kind={m.kind} verdict={m.verdict} />
              ))}
            </div>
          </div>

          {hasEvidence && (
            <div className="replayEvidence" data-testid="replay-evidence-snapshot">
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
          <button className="btn btn-primary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
