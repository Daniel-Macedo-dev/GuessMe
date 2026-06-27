import type { Evidence, EvidenceEntry, IntelEntry, SolvedSummary } from "../helpers/deriveEvidence";

type Props = {
  evidence: Evidence;
  solved: SolvedSummary | null;
  questionsCount: number;
};

const VERDICT_LABEL: Record<string, string> = {
  confirmed: "Sim",
  refuted: "Não",
  inconclusive: "Talvez",
};

const VERDICT_CLASS: Record<string, string> = {
  confirmed: "nbVerdictSim",
  refuted: "nbVerdictNao",
  inconclusive: "nbVerdictTalvez",
};

function EvidenceItem({ entry }: { entry: EvidenceEntry }) {
  return (
    <li className="nbEntry">
      <span className={`nbVerdict ${VERDICT_CLASS[entry.kind]}`}>
        {VERDICT_LABEL[entry.kind]}
      </span>
      <span className="nbQuestion">{entry.question}</span>
    </li>
  );
}

function IntelItem({ entry }: { entry: IntelEntry }) {
  return (
    <li className="nbEntry nbEntryIntel">
      <span className="nbVerdict nbVerdictIntel">Pista</span>
      <span className="nbQuestion">{entry.text}</span>
    </li>
  );
}

type SectionProps = {
  title: string;
  count: number;
  testId: string;
  children: React.ReactNode;
  colorClass?: string;
};

function Section({ title, count, testId, children, colorClass = "" }: SectionProps) {
  if (count === 0) return null;
  return (
    <div className={`nbSection ${colorClass}`} data-testid={testId}>
      <h4 className="nbSectionTitle">
        {title}
        <span className="nbCount">{count}</span>
      </h4>
      <ul className="nbList">{children}</ul>
    </div>
  );
}

export default function EvidenceNotebook({ evidence, solved, questionsCount }: Props) {
  const { confirmed, refuted, inconclusive, hints } = evidence;
  const total = confirmed.length + refuted.length + inconclusive.length + hints.length;
  const isEmpty = total === 0 && !solved;

  return (
    <aside className="notebook panel" aria-label="Caderno de Evidências" data-testid="evidence-notebook">
      <div className="nbHeader">
        <h3 className="nbTitle">Caderno de Evidências</h3>
        {!isEmpty && (
          <span className="nbMeta muted">{questionsCount} interrogação{questionsCount !== 1 ? "ões" : ""}</span>
        )}
      </div>

      {isEmpty && (
        <div className="nbEmpty" data-testid="evidence-empty">
          <p className="muted small">
            Sem evidências ainda.<br />
            Faça perguntas para acumular pistas.
          </p>
        </div>
      )}

      {solved && (
        <div className="nbSolved" data-testid="notebook-solved">
          <span className="nbSolvedStamp">Caso Encerrado</span>
          <p className="nbSolvedName">{solved.name}</p>
          {solved.work && <p className="nbSolvedWork muted small">{solved.work}</p>}
        </div>
      )}

      <Section title="Confirmado" count={confirmed.length} testId="evidence-confirmed" colorClass="nbSectionSim">
        {confirmed.map((e) => <EvidenceItem key={e.id} entry={e} />)}
      </Section>

      <Section title="Refutado" count={refuted.length} testId="evidence-refuted" colorClass="nbSectionNao">
        {refuted.map((e) => <EvidenceItem key={e.id} entry={e} />)}
      </Section>

      <Section title="Inconclusivo" count={inconclusive.length} testId="evidence-inconclusive" colorClass="nbSectionTalvez">
        {inconclusive.map((e) => <EvidenceItem key={e.id} entry={e} />)}
      </Section>

      <Section title="Inteligência" count={hints.length} testId="evidence-intel" colorClass="nbSectionIntel">
        {hints.map((h) => <IntelItem key={h.id} entry={h} />)}
      </Section>
    </aside>
  );
}
