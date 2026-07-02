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
      <div className="statGroup">
        <div className="stat">
          <span className="statLabel">
            <DossierIcon name="magnifier" size={9} aria-hidden={true} className="statLabelIcon" />
            Interrogações
          </span>
          <span className="statValue" data-testid="questions-count">{questionsCount}</span>
        </div>
        <div className="stat">
          <span className="statLabel">
            <DossierIcon name="clue" size={9} aria-hidden={true} className="statLabelIcon" />
            Pistas
          </span>
          <span className="statValue statValueHints" data-testid="hints-count">{hintsCount}</span>
        </div>
      </div>
      <div className="statTelemetry">
        <span className="statTelemetryLabel" aria-hidden="true">STATUS</span>
        <span className="statPhase muted">{investigationPhase(questionsCount)}</span>
      </div>
    </div>
  );
}
