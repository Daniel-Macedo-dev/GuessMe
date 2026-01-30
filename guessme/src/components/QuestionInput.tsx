import { useEffect, useRef, useState } from "react";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onSend: (question: string) => void;
};

export default function QuestionInput({ disabled, loading, onSend }: Props) {
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

  return (
    <div className="inputRow">
      <input
        ref={ref}
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Faça uma pergunta (ex: É humano?)"
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
        Enviar
      </button>
    </div>
  );
}
