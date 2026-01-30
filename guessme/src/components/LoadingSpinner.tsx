export default function LoadingSpinner() {
  return (
    <div className="loadingRow" aria-live="polite">
      <span className="spinner" />
      <span className="muted">Carregando…</span>
    </div>
  );
}
