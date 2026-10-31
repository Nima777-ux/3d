type Props = {
  id: string;
  index: string;
  label: string;
  title: string;
  accent?: string;
  intro?: string;
};

export default function SectionHeading({ id, index, label, title, accent, intro }: Props) {
  return (
    <header className="section-heading">
      <p className="eyebrow">
        {index} — {label}
      </p>
      <h2 id={id} className="section-heading__title">
        {title}
        {accent ? <span className="serif-accent accent"> {accent}</span> : null}
      </h2>
      {intro ? <p className="section-heading__intro">{intro}</p> : null}
    </header>
  );
}
