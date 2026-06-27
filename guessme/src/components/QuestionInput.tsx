import { useEffect, useRef, useState } from "react";

const MAX_LEN = 300;

type Props = {
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
  onSend: (question: string) => void;
};

export default function QuestionInput({ disabled, loading, placeholder, onSend }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  const overLimit = value.length > MAX_LEN;
  const nearLimit = !overLimit && value.length > MAX_LEN * 0.88;

  function submit() {
    const v = value.trim();
    if (!v || overLimit) return;
    onSend(v);
    setValue("");
  }

  const resolvedPlaceholder = placeholder ?? "Faça uma pergunta (ex: É humano?)";

  return (
    <div className="inputArea">
      <div className="inputRow">
        <input
          ref={ref}
          className={`input${overLimit ? " inputOverLimit" : ""}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={resolvedPlaceholder}
          disabled={disabled || loading}
          aria-label="Pergunta para a investigação"
          aria-describedby={value.length > 0 ? "q-char-count" : undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />

        <button
          className="btn btn-primary"
          onClick={submit}
          disabled={disabled || loading || overLimit}
        >
          {loading ? "Aguardando…" : "Enviar"}
        </button>
      </div>

      {value.length > 0 && (
        <span
          id="q-char-count"
          className={`charCount${overLimit ? " charCountError" : nearLimit ? " charCountWarn" : ""}`}
          aria-live="polite"
        >
          {value.length}/{MAX_LEN}
        </span>
      )}
    </div>
  );
}
