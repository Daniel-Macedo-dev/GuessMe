type Variant = "active" | "closed" | "classified" | "archived" | "intel";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
};

const VARIANT_CLASS: Record<Variant, string> = {
  active:     "caseStamp--active",
  closed:     "caseStamp--closed",
  classified: "caseStamp--classified",
  archived:   "caseStamp--archived",
  intel:      "caseStamp--intel",
};

export default function CaseStamp({
  children,
  variant = "classified",
  size = "md",
  pulse = false,
  className = "",
}: Props) {
  return (
    <span
      className={[
        "caseStamp",
        VARIANT_CLASS[variant],
        `caseStamp--${size}`,
        pulse ? "caseStamp--pulse" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
