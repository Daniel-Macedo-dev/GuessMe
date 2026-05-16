import { useEffect, useRef, useState } from "react";

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

  function submit() {
    const v = value.trim();
    if (!v) return;
    onSend(v);
    setValue("");
  }

  const resolvedPlaceholder =
    placeholder ?? "Faça uma pergunta (ex: É humano?)";

  return (
    <div className="inputRow">
      <input
        ref={ref}
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={resolvedPlaceholder}
        disabled={disabled || loading}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />

      <button
        className="btn btn-primary"
        onClick={submit}
        disabled={disabled || loading}
      >
        {loading ? "Aguardando…" : "Enviar"}
      </button>
    </div>
  );
}
