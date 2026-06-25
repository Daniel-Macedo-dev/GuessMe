import CategorySelect from "./CategorySelect";

type Props = {
  onRestart: () => void;
  onHint: () => void;
  hintLoading?: boolean;
  solved?: boolean;

  categories: string[];
  category: string;
  onChangeCategory: (c: string) => void;
};

export default function GameHeader({
  onRestart,
  onHint,
  hintLoading,
  solved = false,
  categories,
  category,
  onChangeCategory,
}: Props) {
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
          Interrogue a IA com perguntas fechadas. Colete pistas. Quando souber a resposta, revele o suspeito.
        </p>
      </div>

      <div className="gameHeaderActions">
        <CategorySelect
          value={category}
          options={categories}
          onChange={onChangeCategory}
          disabled={!!hintLoading || solved}
        />

        <button className="btn" onClick={onHint} disabled={!!hintLoading || solved}>
          {hintLoading ? "Buscando pista…" : "Solicitar pista"}
        </button>

        <button className="btn btn-primary" onClick={onRestart}>
          Novo caso
        </button>
      </div>
    </div>
  );
}
