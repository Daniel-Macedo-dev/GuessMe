export default function LoadingSpinner() {
  return (
    <div className="loadingRow" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="muted">Analisando…</span>
    </div>
  );
}
