import CategorySelect from "./CategorySelect";
import DossierIcon from "./DossierIcon";
import CaseStatusBadge from "./CaseStatusBadge";
import type { CaseVisualStatus } from "../helpers/caseVisualStatus";

type Props = {
  onRestart: () => void;
  onHint: () => void;
  hintLoading?: boolean;
  hintDisabled?: boolean;
  solved?: boolean;
  caseStatus: CaseVisualStatus;

  categories: string[];
  category: string;
  onChangeCategory: (c: string) => void;
};

export default function GameHeader({
  onRestart,
  onHint,
  hintLoading,
  hintDisabled,
  solved = false,
  caseStatus,
  categories,
  category,
  onChangeCategory,
}: Props) {
  const hintBlocked = !!hintLoading || !!hintDisabled || solved;

  return (
    <div className="gameHeader">
      <div className="gameHeaderLeft">
        <div className="dossierEyebrow gameEyebrow" aria-hidden="true">
          <span>REGISTRO DE INTERROGAÇÃO</span>
          <span className="dossierEyebrowDot" />
          <span>ACESSO RESTRITO</span>
          <span className="dossierEyebrowDot" />
          <span>IA-1</span>
        </div>
        <div className="gameHeaderTitleRow">
          <h1 className="h2">
            {solved ? "Investigação Concluída" : "Investigação Ativa"}
          </h1>
          <CaseStatusBadge status={caseStatus} />
        </div>
        <p className="muted gameSubtitle">
          {solved
            ? "Suspeito identificado — caso arquivado."
            : "Interrogue. Acumule evidências. Revele o suspeito."}
        </p>
      </div>

      <div className="gameHeaderActions">
        <CategorySelect
          label="Domínio"
          value={category}
          options={categories}
          onChange={onChangeCategory}
          disabled={hintBlocked}
        />

        <button
          className="btn"
          onClick={onHint}
          disabled={hintBlocked}
          aria-busy={hintLoading ? "true" : undefined}
          aria-label={hintLoading ? "Solicitando pista…" : "Solicitar pista"}
        >
          <DossierIcon name="clue" size={13} aria-hidden={true} />
          {hintLoading ? "Buscando pista…" : "Solicitar pista"}
        </button>

        <button className="btn btn-primary" onClick={onRestart}>
          <DossierIcon name="case-file" size={13} aria-hidden={true} />
          Novo caso
        </button>
      </div>
    </div>
  );
}
