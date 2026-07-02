import DossierIcon from "./DossierIcon";
import type { CaseVisualStatus } from "../helpers/caseVisualStatus";
import { CASE_STATUS_LABELS } from "../helpers/caseVisualStatus";

type Props = {
  status: CaseVisualStatus;
};

const STATUS_ICON: Record<CaseVisualStatus, Parameters<typeof DossierIcon>[0]["name"]> = {
  idle:      "case-file",
  opening:   "case-file",
  active:    "magnifier",
  analyzing: "magnifier",
  clue:      "clue",
  solved:    "check",
  error:     "warning",
};

export default function CaseStatusBadge({ status }: Props) {
  const label = CASE_STATUS_LABELS[status];
  const iconName = STATUS_ICON[status];

  return (
    <span
      className={`caseStatusStrip caseStatusStrip--${status}`}
      role="img"
      aria-label={`Status do caso: ${label.toLowerCase()}`}
    >
      <DossierIcon name={iconName} size={10} aria-hidden={true} />
      <span aria-hidden="true">{label}</span>
    </span>
  );
}
