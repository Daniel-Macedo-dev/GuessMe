export default function LoadingSpinner() {
  return (
    <div className="loadingRow">
      <span className="spinner" aria-hidden="true" />
      <span className="muted">Analisando…</span>
    </div>
  );
}
