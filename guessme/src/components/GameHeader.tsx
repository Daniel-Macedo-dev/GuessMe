import CategorySelect from "./CategorySelect";
import DossierIcon from "./DossierIcon";

type Props = {
  onRestart: () => void;
  onHint: () => void;
  hintLoading?: boolean;
  hintDisabled?: boolean;
  solved?: boolean;

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
  categories,
  category,
  onChangeCategory,
}: Props) {
  const hintBlocked = !!hintLoading || !!hintDisabled || solved;

  return (
    <div className="gameHeader">
      <div className="gameHeaderLeft">
        <h2 className="h2">
          {solved ? "Investigação Concluída" : "Investigação Ativa"}
          <span className={`caseStatusBadge${solved ? " caseStatusBadgeSolved" : ""}`}>
            {solved ? "Caso Encerrado" : "Caso Aberto"}
          </span>
        </h2>
        <p className="muted gameSubtitle">
          Interrogue. Acumule evidências. Revele o suspeito.
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
