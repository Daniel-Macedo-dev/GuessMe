type Props = {
  value: string;
  disabled: boolean;
  placeholder: string;
  onChange: (v: string) => void;
  onSend: () => void;
  sending: boolean;
};

export default function QuestionInput({ value, disabled, placeholder, onChange, onSend, sending }: Props) {
  const canSend = !disabled && !sending && value.trim().length > 0;

  return (
    <div className="inputRow">
      <input
        className="input"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canSend) onSend();
        }}
      />
      <button className="btn btn-primary" disabled={!canSend} onClick={onSend}>
        {sending ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
