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
        <h2 className="h2">Partida</h2>
        <p className="muted gameSubtitle">
          Faça perguntas de sim/não. Quando tiver certeza, chute o nome.
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
          {hintLoading ? "Dica..." : "Pedir dica"}
        </button>

        <button className="btn btn-primary" onClick={onRestart}>
          Reiniciar
        </button>
      </div>
    </div>
  );
}
