export default function LoadingSpinner() {
  return (
    <div className="loadingRow" role="status" aria-label="Analisando evidências">
      <div className="investigationDots" aria-hidden="true">
        <span className="investigationDot" />
        <span className="investigationDot" />
        <span className="investigationDot" />
      </div>
      <span className="muted" aria-hidden="true">Analisando evidências…</span>
    </div>
  );
}
