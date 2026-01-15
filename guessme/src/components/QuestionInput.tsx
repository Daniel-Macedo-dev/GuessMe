type Props = {
  value: string;
  disabled: boolean;
  placeholder: string;
  onChange: (v: string) => void;
  onSend: () => void;
  sending: boolean;
};

export default function QuestionInput({
  value,
  disabled,
  placeholder,
  onChange,
  onSend,
  sending,
}: Props) {
  return (
    <div className="chat-input-area p-3 d-flex gap-2">
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend();
        }}
        disabled={disabled}
      />

      <button className="btn btn-success" onClick={onSend} disabled={disabled}>
        {sending ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
