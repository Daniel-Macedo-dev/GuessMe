type Props = {
  disabled?: boolean;
  onPick: (text: string) => void;
};

const CHIPS = [
  "É humano?",
  "É de anime?",
  "É de jogo?",
  "É herói?",
  "É vilão?",
  "Tem poderes?",
];

export default function AnswerChips({ disabled, onPick }: Props) {
  return (
    <div className="chips">
      {CHIPS.map((c) => (
        <button
          key={c}
          className="chip"
          disabled={disabled}
          onClick={() => onPick(c)}
          title={disabled ? "Aguarde / jogo finalizado" : "Enviar pergunta"}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
