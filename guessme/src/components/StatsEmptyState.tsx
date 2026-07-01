import { Link } from "react-router-dom";
import DossierIcon from "./DossierIcon";

export default function StatsEmptyState() {
  return (
    <div className="statsEmpty" data-testid="stats-empty">
      <div className="emptyIllustration statsEmptyIllustration" aria-hidden="true">
        <DossierIcon name="stats" size={28} aria-hidden={true} className="dossierIcon--accent" />
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
