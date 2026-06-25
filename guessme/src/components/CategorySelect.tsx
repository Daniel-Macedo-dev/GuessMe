import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
};

export default function CategorySelect({ value, options, onChange, disabled, label }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const safeValue = (value || "").trim() || "Geral";

  const items = useMemo(() => {
    // garante "Geral" primeiro se existir
    const uniq = Array.from(new Set(options.map((o) => o.trim()).filter(Boolean)));
    const hasGeral = uniq.some((x) => x.toLowerCase() === "geral");
    if (!hasGeral) uniq.unshift("Geral");
    // coloca Geral no topo
    uniq.sort((a, b) => {
      const ag = a.toLowerCase() === "geral";
      const bg = b.toLowerCase() === "geral";
      if (ag && !bg) return -1;
      if (!ag && bg) return 1;
      return a.localeCompare(b);
    });
    return uniq;
  }, [options]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  function pick(opt: string) {
    onChange(opt);
    setOpen(false);
  }

  return (
    <div className={`catSelect ${disabled ? "isDisabled" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="catSelectBtn"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {label && <span className="catSelectLabel">{label}</span>}
        <span className="catSelectValue">{safeValue}</span>
        <span className={`catSelectChevron ${open ? "open" : ""}`} aria-hidden="true" />
      </button>

      {open ? (
        <div className="catSelectMenu" role="listbox">
          {items.map((opt) => {
            const active = opt === safeValue;
            return (
              <button
                key={opt}
                type="button"
                className={`catSelectItem ${active ? "active" : ""}`}
                onClick={() => pick(opt)}
                role="option"
                aria-selected={active}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
