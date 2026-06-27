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
  const menuRef = useRef<HTMLDivElement | null>(null);

  const safeValue = (value || "").trim() || "Geral";

  const items = useMemo(() => {
    const uniq = Array.from(new Set(options.map((o) => o.trim()).filter(Boolean)));
    const hasGeral = uniq.some((x) => x.toLowerCase() === "geral");
    if (!hasGeral) uniq.unshift("Geral");
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

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (open && menuRef.current) {
      const active = menuRef.current.querySelector<HTMLElement>(".catSelectItem.active");
      const first = menuRef.current.querySelector<HTMLElement>(".catSelectItem");
      (active ?? first)?.focus();
    }
  }, [open]);

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
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label ? label + ": " : ""}${safeValue}`}
      >
        {label && <span className="catSelectLabel">{label}</span>}
        <span className="catSelectValue">{safeValue}</span>
        <span className={`catSelectChevron ${open ? "open" : ""}`} aria-hidden="true" />
      </button>

      {open ? (
        <div className="catSelectMenu" role="menu" ref={menuRef} aria-label="Domínio da investigação">
          {items.map((opt) => {
            const active = opt === safeValue;
            return (
              <button
                key={opt}
                type="button"
                className={`catSelectItem ${active ? "active" : ""}`}
                onClick={() => pick(opt)}
                role="menuitemradio"
                aria-checked={active}
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
