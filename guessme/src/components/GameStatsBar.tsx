type Props = {
  questionsCount: number;
};

function investigationPhase(count: number): string {
  if (count === 0) return "Nenhuma evidência coletada";
  if (count < 6) return "Fase inicial — delimite o perfil do suspeito";
  if (count < 14) return "Fase intermediária — estreite o cerco";
  if (count < 30) return "Fase avançada — identifique o suspeito";
  return "Fase crítica — aja antes que o caso esfrie";
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
