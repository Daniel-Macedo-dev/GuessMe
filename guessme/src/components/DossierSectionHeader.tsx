type Props = {
  label: string;
  title: string;
  meta?: string;
  level?: 1 | 2 | 3;
};

export default function DossierSectionHeader({ label, title, meta, level = 2 }: Props) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return (
    <div className="dossierSectionHeader">
      <span className="dossierSectionLabel">{label}</span>
      <Tag className="dossierSectionTitle">{title}</Tag>
      {meta && <span className="dossierSectionMeta muted small">{meta}</span>}
    </div>
  );
}
