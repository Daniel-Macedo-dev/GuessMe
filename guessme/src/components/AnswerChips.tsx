type Props = {
  chips: string[];
};

export default function AnswerChips({ chips }: Props) {
  if (!chips.length) return <div className="chips-empty">Sem respostas ainda.</div>;

  return (
    <div className="chips-row">
      {chips.map((c, idx) => (
        <span
          key={`${c}-${idx}`}
          className={
            c === "Sim" ? "chip chip-yes" : c === "Não" ? "chip chip-no" : "chip chip-maybe"
          }
        >
          {c}
        </span>
      ))}
    </div>
  );
}
