import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";

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
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === "Tab" && menuRef.current) {
        if (!menuRef.current.contains(document.activeElement)) {
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
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
    triggerRef.current?.focus();
  }

  function moveMenuFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(".catSelectItem"),
    );
    if (options.length === 0) return;
    const current = options.indexOf(document.activeElement as HTMLButtonElement);
    let next: number | null = null;
    if (event.key === "ArrowDown") next = (current + 1) % options.length;
    if (event.key === "ArrowUp") next = (current - 1 + options.length) % options.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = options.length - 1;
    if (next === null) return;
    event.preventDefault();
    options[next].focus();
  }

  return (
    <div className={`catSelect ${disabled ? "isDisabled" : ""}`} ref={rootRef}>
      <button
        ref={triggerRef}
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
        <div
          className="catSelectMenu"
          role="menu"
          ref={menuRef}
          aria-label="Domínio da investigação"
          onKeyDown={moveMenuFocus}
        >
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
