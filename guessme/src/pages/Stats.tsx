import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatsEmptyState from "../components/StatsEmptyState";
import StatsOverviewGrid from "../components/StatsOverviewGrid";
import StatsVerdictPanel from "../components/StatsVerdictPanel";
import StatsCategoryPanel from "../components/StatsCategoryPanel";
import StatsEvidencePanel from "../components/StatsEvidencePanel";
import StatsCaseRanking from "../components/StatsCaseRanking";
import StatsRecentActivity from "../components/StatsRecentActivity";
import AgentDossierPanel from "../components/AgentDossierPanel";
import { getCaseHistory } from "../services/caseHistoryStorage";
import { deriveCaseStats } from "../helpers/caseStats";
import { derivePlayerProgression } from "../helpers/progression";

export default function Stats() {
  const stats = useMemo(() => {
    const history = getCaseHistory();
    return {
      history,
      data: deriveCaseStats(history),
      progression: derivePlayerProgression(history),
    };
  }, []);

  const { history, data, progression } = stats;

  const overviewMetrics = [
    {
      label: "Casos resolvidos",
      value: data.totalCases,
      testId: "stats-total-cases",
      accent: "green" as const,
      icon: "case-file" as const,
    },
    {
      label: "Perguntas feitas",
      value: data.totalQuestions,
      testId: "stats-total-questions",
      icon: "magnifier" as const,
    },
    {
      label: "Pistas usadas",
      value: data.totalHints,
      testId: "stats-total-hints",
      accent: "amber" as const,
      icon: "clue" as const,
    },
    {
      label: "Média de perguntas",
      value: data.totalCases > 0 ? data.averageQuestions : "—",
      sub: "por caso",
      testId: "stats-avg-questions",
      accent: "slate" as const,
      icon: "stats" as const,
    },
  ];

  return (
    <div className="shell shell--stats">
      <Navbar />
      <main id="main-content" className="main statsMain" tabIndex={-1} data-testid="stats-page">
        <div className="statsPageHeader">
          <div className="dossierEyebrow statsEyebrow" aria-hidden="true">
            <span>RELATÓRIO DE INTELIGÊNCIA</span>
            <span className="dossierEyebrowDot" />
            <span>USO RESTRITO</span>
          </div>
          <div className="caseStamp caseStamp--active caseStamp--sm">Painel de investigação</div>
          <h1 className="statsPageTitle">Estatísticas pessoais</h1>
          <Link className="btn statsArchiveLink" to="/archive">Ver Arquivo de Casos</Link>
          {history.length > 0 && (
            <p className="muted small">
              {data.uniqueCharacters} personagem{data.uniqueCharacters !== 1 ? "s" : ""} identificado{data.uniqueCharacters !== 1 ? "s" : ""} em {data.totalCases} caso{data.totalCases !== 1 ? "s" : ""}
            </p>
          )}
          <div className="statsReportBand" aria-hidden="true">
            {[
              { label: "Classificação", value: "Restrita" },
              { label: "Fonte", value: "Arquivo local" },
              { label: "Período", value: "Integral" },
              { label: "Casos", value: data.totalCases },
            ].map((f) => (
              <span className="statsReportField" key={f.label}>
                <span className="statsReportFieldLabel">{f.label}</span>
                <span className="statsReportFieldValue">{f.value}</span>
              </span>
            ))}
          </div>
        </div>

        {history.length === 0 ? (
          <>
            <AgentDossierPanel progression={progression} />
            <StatsEmptyState />
          </>
        ) : (
          <div className="statsDashboard" data-testid="stats-dashboard">
            <AgentDossierPanel progression={progression} />
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
      <Footer />
    </div>
  );
}
