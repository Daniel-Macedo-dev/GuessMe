import { useMemo } from "react";
import Navbar from "../components/Navbar";
import StatsEmptyState from "../components/StatsEmptyState";
import StatsOverviewGrid from "../components/StatsOverviewGrid";
import StatsVerdictPanel from "../components/StatsVerdictPanel";
import StatsCategoryPanel from "../components/StatsCategoryPanel";
import StatsEvidencePanel from "../components/StatsEvidencePanel";
import StatsCaseRanking from "../components/StatsCaseRanking";
import StatsRecentActivity from "../components/StatsRecentActivity";
import { getCaseHistory } from "../services/caseHistoryStorage";
import { deriveCaseStats } from "../helpers/caseStats";

export default function Stats() {
  const stats = useMemo(() => {
    const history = getCaseHistory();
    return { history, data: deriveCaseStats(history) };
  }, []);

  const { history, data } = stats;

  const overviewMetrics = [
    {
      label: "Casos resolvidos",
      value: data.totalCases,
      testId: "stats-total-cases",
      accent: "green" as const,
    },
    {
      label: "Perguntas feitas",
      value: data.totalQuestions,
      testId: "stats-total-questions",
    },
    {
      label: "Pistas usadas",
      value: data.totalHints,
      testId: "stats-total-hints",
    },
    {
      label: "Média de perguntas",
      value: data.totalCases > 0 ? data.averageQuestions : "—",
      sub: "por caso",
      testId: "stats-avg-questions",
    },
  ];

  return (
    <div className="shell">
      <Navbar />
      <main className="main" data-testid="stats-page">
        <div className="statsPageHeader">
          <div className="statsPageStamp caseSolvedStamp">Painel de investigação</div>
          <h1 className="statsPageTitle">Estatísticas pessoais</h1>
          {history.length > 0 && (
            <p className="muted small">
              {data.uniqueCharacters} personagem{data.uniqueCharacters !== 1 ? "s" : ""} identificado{data.uniqueCharacters !== 1 ? "s" : ""} em {data.totalCases} caso{data.totalCases !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {history.length === 0 ? (
          <StatsEmptyState />
        ) : (
          <div className="statsDashboard" data-testid="stats-dashboard">
            <StatsOverviewGrid metrics={overviewMetrics} />

            <div className="statsPanelGrid">
              <StatsVerdictPanel verdicts={data.verdictTotals} />
              <StatsEvidencePanel evidence={data.evidenceTotals} />
            </div>

            <StatsCategoryPanel categories={data.categoryBreakdown} />

            <StatsCaseRanking
              bestCase={data.bestCase}
              longestCase={data.longestCase}
            />

            <StatsRecentActivity cases={data.recentCases} />
          </div>
        )}
      </main>
    </div>
  );
}
