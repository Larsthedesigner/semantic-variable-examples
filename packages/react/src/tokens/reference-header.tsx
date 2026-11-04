export function ReferenceHeader({ eyebrow, title, description, summary }: {
  eyebrow: string;
  title: string;
  description: string;
  summary?: string;
}) {
  return (
    <header className="sbx-reference-header">
      <p className="sbx-reference-header__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="sbx-reference-header__description">{description}</p>
      {summary && <p className="sbx-reference-header__summary">{summary}</p>}
    </header>
  );
}
