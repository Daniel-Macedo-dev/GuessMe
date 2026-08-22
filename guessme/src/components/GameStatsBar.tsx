import DossierIcon from "./DossierIcon";

type Props = {
  questionsCount: number;
  hintsCount: number;
};

function investigationPhase(count: number): string {
  if (count === 0) return "Nenhuma evidência coletada";
  if (count < 6) return "Fase inicial — delimite o perfil do suspeito";
  if (count < 14) return "Fase intermediária — estreite o cerco";
  if (count < 30) return "Fase avançada — identifique o suspeito";
  return "Fase crítica — aja antes que o caso esfrie";
}

export default function GameStatsBar({ questionsCount, hintsCount }: Props) {
  return (
    <div className="statsBar">
      <dl className="statGroup">
        <div className="stat">
          <dt className="statLabel">
            <DossierIcon name="magnifier" size={9} aria-hidden={true} className="statLabelIcon" />
            Interrogações
          </dt>
          <dd className="statValue" data-testid="questions-count" aria-live="polite">{questionsCount}</dd>
        </div>
        <div className="stat">
          <dt className="statLabel">
            <DossierIcon name="clue" size={9} aria-hidden={true} className="statLabelIcon" />
            Pistas
          </dt>
          <dd className="statValue statValueHints" data-testid="hints-count" aria-live="polite">{hintsCount}</dd>
        </div>
      </dl>
      <div className="statTelemetry">
        <span className="statTelemetryLabel" aria-hidden="true">STATUS</span>
        <span className="statPhase muted">{investigationPhase(questionsCount)}</span>
      </div>
    </div>
  );
}
