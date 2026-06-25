import CategorySelect from "./CategorySelect";

type Props = {
  onRestart: () => void;
  onHint: () => void;
  hintLoading?: boolean;

  categories: string[];
  category: string;
  onChangeCategory: (c: string) => void;
};

export default function GameHeader({
  onRestart,
  onHint,
  hintLoading,
  categories,
  category,
  onChangeCategory,
}: Props) {
  return (
    <div className="gameHeader">
      <div className="gameHeaderLeft">
        <h2 className="h2">
          Investigação Ativa
          <span className="caseStatusBadge">Caso Aberto</span>
        </h2>
        <p className="muted gameSubtitle">
          Interrogue a IA com perguntas fechadas. Colete pistas. Quando souber a resposta, revele o suspeito.
        </p>
      </div>

      <div className="gameHeaderActions">
        <CategorySelect
          value={category}
          options={categories}
          onChange={onChangeCategory}
          disabled={hintLoading}
        />

        <button className="btn" onClick={onHint} disabled={!!hintLoading}>
          {hintLoading ? "Buscando pista…" : "Solicitar pista"}
        </button>

        <button className="btn btn-primary" onClick={onRestart}>
          Novo caso
        </button>
      </div>
    </div>
  );
}
