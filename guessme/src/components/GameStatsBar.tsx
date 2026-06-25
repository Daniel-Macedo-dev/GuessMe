type Props = {
  questionsCount: number;
};

function investigationPhase(count: number): string {
  if (count === 0) return "Caso recém-aberto";
  if (count < 6) return "Fase inicial — explore o perfil";
  if (count < 12) return "Fase intermediária — estreite o cerco";
  return "Fase avançada — identifique o suspeito";
}

export default function GameStatsBar({ questionsCount }: Props) {
  return (
    <div className="statsBar">
      <div className="stat">
        <span className="statLabel">Interrogações</span>
        <span className="statValue">{questionsCount}</span>
      </div>
      <div className="statPhase muted">{investigationPhase(questionsCount)}</div>
    </div>
  );
}
