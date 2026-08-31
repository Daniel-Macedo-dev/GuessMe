import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CaseHistoryCard from "../components/CaseHistoryCard";
import CaseReplayModal from "../components/CaseReplayModal";
import ArchiveMark from "../components/ArchiveMark";
import DossierIcon from "../components/DossierIcon";
import { useCaseHistory } from "../hooks/useCaseHistory";
import {
  archiveQueryFromParams,
  archiveQueryToParams,
  DEFAULT_ARCHIVE_QUERY,
  queryArchive,
  type ArchiveQuery,
} from "../helpers/archiveQuery";
import { CaseImportError, parseArchiveExportJson, parseCaseExportJson } from "../helpers/caseImport";
import { buildArchiveExportFilename, createArchiveExportPayload } from "../helpers/caseExport";
import { downloadJsonFile } from "../services/caseExportService";
import { CASE_HISTORY_CAPACITY } from "../services/caseHistoryStorage";
import type { CaseHistoryEntry } from "../types/guessme";

type Status = { kind: "success" | "error"; message: string } | null;

export default function Archive() {
  const { history, deleteEntry, clearAll, importEntry, importArchive } = useCaseHistory();
  const [params, setParams] = useSearchParams();
  const [replayEntry, setReplayEntry] = useState<CaseHistoryEntry | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clearTriggerRef = useRef<HTMLButtonElement>(null);
  const query = archiveQueryFromParams(params);
  const results = queryArchive(history, query);
  const categories = useMemo(() => [...new Set(history.map((entry) => entry.category))].sort((a, b) => a.localeCompare(b, "pt-BR")), [history]);
  const hasFilters = archiveQueryToParams(query).toString() !== "";

  function update(next: Partial<ArchiveQuery>, replace = false) {
    setParams(archiveQueryToParams({ ...query, ...next }), { replace });
  }

  function exportArchive() {
    if (history.length === 0) return;
    downloadJsonFile(buildArchiveExportFilename(), createArchiveExportPayload(history));
    setStatus({ kind: "success", message: `${history.length} caso${history.length === 1 ? "" : "s"} exportado${history.length === 1 ? "" : "s"}.` });
  }

  function handleFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () => setStatus({ kind: "error", message: "Não foi possível ler o arquivo." });
    reader.onload = () => {
      try {
        const raw = String(reader.result ?? "");
        try {
          const bundle = parseArchiveExportJson(raw);
          const result = importArchive(bundle.entries);
          if (!result.saved) throw new CaseImportError("O navegador recusou a gravação. Nenhum caso foi importado.");
          setStatus({
            kind: "success",
            message: `${result.imported} importado${result.imported === 1 ? "" : "s"}; ${result.skipped} duplicado${result.skipped === 1 ? "" : "s"} ignorado${result.skipped === 1 ? "" : "s"}; ${result.renamed} ID renomeado${result.renamed === 1 ? "" : "s"}; ${bundle.rejected} inválido${bundle.rejected === 1 ? "" : "s"} rejeitado${bundle.rejected === 1 ? "" : "s"}.${result.evicted ? ` ${result.evicted} caso antigo não coube no limite.` : ""}`,
          });
        } catch (error) {
          if (!(error instanceof CaseImportError) || !error.message.startsWith("Formato desconhecido")) throw error;
          const entry = parseCaseExportJson(raw);
          const result = importEntry(entry);
          if (!result.saved) throw new CaseImportError("O navegador recusou a gravação.");
          setStatus({ kind: "success", message: result.renamed ? "Caso importado com ID renomeado." : "Caso importado com sucesso." });
        }
      } catch (error) {
        setStatus({ kind: "error", message: error instanceof Error ? error.message : "Falha inesperada na importação." });
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="shell shell--archive">
      <Navbar />
      <main id="main-content" className="main archiveMain" tabIndex={-1} data-testid="archive-page">
        <header className="archiveHero">
          <div className="archiveHeroMark" aria-hidden="true"><ArchiveMark /></div>
          <div>
            <div className="dossierEyebrow" aria-hidden="true">ARQUIVO DE INTELIGÊNCIA · RETENÇÃO LOCAL</div>
            <h1>Arquivo de Casos</h1>
            <p className="muted">Consulte, reveja e transporte os dossiês encerrados neste navegador.</p>
          </div>
          <div className="archiveCapacity" data-testid="archive-capacity">
            <strong>{history.length}/{CASE_HISTORY_CAPACITY}</strong>
            <span>casos preservados localmente</span>
          </div>
        </header>

        <section className="archiveRetention" aria-label="Política de retenção">
          <DossierIcon name="warning" size={16} aria-hidden="true" />
          <p>O arquivo guarda os {CASE_HISTORY_CAPACITY} casos mais recentes. Ao atingir o limite, um novo caso substitui o mais antigo. Exporte uma cópia para preservação permanente.</p>
        </section>

        <section className="archiveToolbar panel" aria-label="Gerenciar arquivo">
          <button className="btn" onClick={() => fileInputRef.current?.click()} data-testid="archive-import-btn"><DossierIcon name="import" size={13} aria-hidden="true" /> Importar JSON</button>
          <input ref={fileInputRef} className="historyImportInput" type="file" accept=".json,application/json" aria-label="Selecionar arquivo JSON" onChange={(event) => { handleFile(event.target.files?.[0]); event.target.value = ""; }} />
          <button className="btn" disabled={history.length === 0} onClick={exportArchive} data-testid="archive-export-btn">Exportar arquivo completo</button>
          {history.length > 0 && (confirmingClear ? (
            <div className="historyClearConfirm" role="group" aria-label="Confirmar limpeza do arquivo">
              <span role="status">Apagar todos?</span>
              <button className="btn historyDeleteBtn" autoFocus onClick={() => { clearAll(); setConfirmingClear(false); setReplayEntry(null); }}>Confirmar</button>
              <button className="btn" onClick={() => { setConfirmingClear(false); requestAnimationFrame(() => clearTriggerRef.current?.focus()); }}>Cancelar</button>
            </div>
          ) : <button ref={clearTriggerRef} className="btn historyDeleteBtn" onClick={() => setConfirmingClear(true)}>Limpar arquivo</button>)}
        </section>

        {status && <div className={`archiveStatus archiveStatus--${status.kind}`} role="status" aria-live="polite" data-testid="archive-status">{status.message}</div>}

        {history.length > 0 ? (
          <>
            <form className="archiveFilters panel" role="search" onSubmit={(event) => event.preventDefault()}>
              <label className="archiveSearch">Pesquisar casos<input type="search" value={query.search} onChange={(event) => update({ search: event.target.value }, true)} placeholder="Personagem, obra ou pergunta decisiva" /></label>
              <label>Categoria<select value={query.category} onChange={(event) => update({ category: event.target.value })}><option value="all">Todas</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label>Pistas<select value={query.hints} onChange={(event) => update({ hints: event.target.value as ArchiveQuery["hints"] })}><option value="all">Todas</option><option value="with">Com pistas</option><option value="without">Sem pistas</option></select></label>
              <label>Período<select value={query.period} onChange={(event) => update({ period: event.target.value as ArchiveQuery["period"] })}><option value="all">Todo o período</option><option value="30">Últimos 30 dias</option><option value="365">Último ano</option></select></label>
              <label>Ordenar<select value={query.sort} onChange={(event) => update({ sort: event.target.value as ArchiveQuery["sort"] })}><option value="newest">Mais recentes</option><option value="oldest">Mais antigos</option><option value="fewest">Menos perguntas</option><option value="most">Mais perguntas</option><option value="az">Personagem A–Z</option></select></label>
              {hasFilters && <button type="button" className="btn archiveReset" onClick={() => setParams(archiveQueryToParams(DEFAULT_ARCHIVE_QUERY))}>Limpar filtros</button>}
            </form>
            <div className="archiveResultsHeader">
              <p role="status" aria-live="polite" data-testid="archive-result-count"><strong>{results.length}</strong> de {history.length} caso{history.length === 1 ? "" : "s"}</p>
            </div>
            {results.length ? <ul className="archiveGrid" aria-label="Casos encontrados">{results.map((entry) => <li key={entry.id}><CaseHistoryCard entry={entry} onReplay={setReplayEntry} onDelete={(id) => { deleteEntry(id); if (replayEntry?.id === id) setReplayEntry(null); }} /></li>)}</ul> : (
              <div className="archiveNoResults" role="status"><h2>Nenhum dossiê encontrado</h2><p className="muted">Revise os termos ou limpe os filtros ativos.</p><button className="btn" onClick={() => setParams(archiveQueryToParams(DEFAULT_ARCHIVE_QUERY))}>Limpar filtros</button></div>
            )}
          </>
        ) : <div className="archiveEmpty panel" role="status"><ArchiveMark className="visualScene--slate" /><h2>O arquivo está vazio</h2><p className="muted">Resolva uma investigação ou importe um arquivo GuessMe.</p><Link className="btn btn-primary" to="/game">Abrir novo caso</Link></div>}

        {replayEntry && <CaseReplayModal entry={replayEntry} onClose={() => setReplayEntry(null)} />}
      </main>
      <Footer />
    </div>
  );
}
