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
      <div>
        <h2 className="h2">Partida</h2>
        <p className="muted">Pergunte com sim/não e tente adivinhar.</p>
      </div>

      <div className="headerActions">
        <div className="selectWrap">
          <select
            className="select"
            value={category}
            onChange={(e) => onChangeCategory(e.target.value)}
            aria-label="Categoria"
            title="Categoria"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button className="btn" onClick={onHint} disabled={!!hintLoading}>
          {hintLoading ? "Dica..." : "Pedir dica"}
        </button>

        <button className="btn" onClick={onRestart}>
          Reiniciar
        </button>
      </div>
    </div>
  );
}
