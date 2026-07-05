import DossierIcon from "./DossierIcon";

type IconName = React.ComponentProps<typeof DossierIcon>["name"];

type Props = {
  icon: IconName;
  title: string;
  /** id for aria-labelledby references on the parent section */
  id?: string;
  /** heading level — keep in sync with the page outline */
  level?: 2 | 3;
  /** removes bottom margin when the header sits inside another flex row */
  flush?: boolean;
};

export default function PanelSectionHeader({ icon, title, id, level = 3, flush = false }: Props) {
  const Heading = level === 2 ? "h2" : "h3";

  return (
    <div className={`panelSectionHeader${flush ? " panelSectionHeader--flush" : ""}`}>
      <DossierIcon name={icon} size={14} aria-hidden={true} className="dossierIcon--muted" />
      <Heading id={id} className="panelSectionTitle">
        {title}
      </Heading>
    </div>
  );
}
