type Props = { chips: string[] };

export default function AnswerChips({ chips }: Props) {
  if (!chips.length) return <div className="muted">Sem respostas ainda.</div>;

  return (
    <div className="chipsRow">
      {chips.map((c, i) => {
        if (c === "yes") return <span key={i} className="chip chipYes">Sim</span>;
        if (c === "no") return <span key={i} className="chip chipNo">Não</span>;
        return <span key={i} className="chip chipMaybe">Talvez</span>;
      })}
    </div>
  );
}
