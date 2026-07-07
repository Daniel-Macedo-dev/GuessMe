import { Link } from "react-router-dom";
import EvidenceNetwork from "./EvidenceNetwork";

export default function StatsEmptyState() {
  return (
    <div className="statsEmpty" data-testid="stats-empty">
      <div className="statsEmptyScene" aria-hidden="true">
        <EvidenceNetwork variant="compact" className="visualScene--slate" />
      </div>
      <div className="statsEmptyStamp caseLabel">ARQUIVO VAZIO</div>
      <p className="statsEmptyTitle">Nenhum caso resolvido ainda</p>
      <p className="muted small statsEmptyDesc">
        Resolva um caso para gerar estatísticas pessoais de investigação.
      </p>
      <Link to="/game" className="btn btn-primary statsEmptyCta" data-testid="stats-empty-cta">
        Abrir um caso
      </Link>
    </div>
  );
}
