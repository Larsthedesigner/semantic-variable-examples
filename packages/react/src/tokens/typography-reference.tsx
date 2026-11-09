import { primitiveTokens, tokenCatalog } from './token-catalog';
import type { TokenMode } from './token-catalog';
import { ReferenceHeader } from './reference-header';

const typeStyles = [
  ['h1', 'Workspace settings'],
  ['h2', 'Team members'],
  ['h3', 'Workspace permissions'],
  ['h4', 'Notification preferences'],
  ['h5', 'Delivery options'],
  ['h6', 'Additional settings'],
  ['body', 'Manage your workspace, invite teammates, and keep everyone moving together.'],
  ['body-secondary', 'Changes apply to all members of this workspace.'],
  ['body-sm', 'Members can view projects and contribute to shared work.'],
  ['label-sm', 'Project identifier'],
  ['label-md', 'Workspace name'],
  ['label-lg', 'Organization name'],
  ['caption', 'Last updated today at 09:41'],
  ['code', 'const workspaceId = "demo";'],
] as const;

export function TypographySemantics({ mode = 'light' }: { mode?: TokenMode }) {
  const catalog = tokenCatalog(mode);
  return (
    <div className={`sbx-reference ${mode}`}>
      <ReferenceHeader
        eyebrow="Foundations / Typography / Semantics"
        title="Typography semantics"
        description="Prescribed content styles bundle font, letter spacing, and foreground. Choose headings by document hierarchy, not visual size. Containers own spacing; controls own their internal typography."
        summary="14 styles / 3 members per bundle / Root-relative sizes"
      />
      {typeStyles.map(([type, sample]) => {
        const prefix = `--system-type-${type}`;
        const members = ['font', 'tracking', 'color'].map(member => {
          const token = catalog.find(entry => entry.name === `${prefix}-${member}`);
          if (!token) throw new Error(`Missing typography member: ${prefix}-${member}`);
          return token;
        });
        const element = /^h[1-6]$/.test(type) ? type : type === 'code' ? 'code' : type.startsWith('label-') || type === 'caption' ? 'span' : 'p';
        return (
          <section className="sbx-type-style" key={type} aria-label={`${type} type bundle`}>
            <div className="sbx-type-style__heading"><h2>{type}</h2><code>&lt;{element}&gt;</code></div>
            <div className="sbx-type-specimen">
              <span style={{
                font: `var(${prefix}-font)`,
                letterSpacing: `var(${prefix}-tracking)`,
                color: `var(${prefix}-color)`,
              }}>{sample}</span>
            </div>
            <p className="sbx-type-usage">{members[0].usage}</p>
            <div className="sbx-table-scroll" role="region" aria-label={`${type} tokens`} tabIndex={0}>
              <table className="sbx-token-table" aria-label={`${type} tokens`}>
                <thead><tr>{['CSS variable', 'Mapping', `Resolved value (${mode})`, 'Primitive dependencies'].map(header => <th key={header} scope="col">{header}</th>)}</tr></thead>
                <tbody>{members.map(token => <tr key={token.name}>
                  <td><code>{token.name}</code></td>
                  <td><code>{token.expression}</code></td>
                  <td><code>{token.value}</code></td>
                  <td><ul className="sbx-token-list">{token.primitives.map(name => <li key={name}><code>{name}</code></li>)}</ul></td>
                </tr>)}</tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function TypographyPrimitives() {
  const groups = [
    { title: 'Font families', pattern: /^--font-family-/, property: 'fontFamily' },
    { title: 'Font weights', pattern: /^--font-weight-/, property: 'fontWeight' },
    { title: 'Font sizes', pattern: /^--font-size-/, property: 'fontSize' },
    { title: 'Unitless line heights', pattern: /^--line-height-ratio-/, property: 'lineHeight' },
    { title: 'Letter spacing', pattern: /^--letter-spacing-/, property: 'letterSpacing' },
    { title: 'Existing control line heights', pattern: /^--line-height-(?!ratio-)/, property: 'lineHeight' },
  ];
  return (
    <div className="sbx-reference">
      <ReferenceHeader
        eyebrow="Foundations / Typography / Primitives"
        title="Typography primitives"
        description="Families, weights, sizes, line-height ratios, and tracking feed the prescribed system bundles. Unitless line heights follow the element's font size. Existing dimension-based control line heights remain unchanged."
      />
      {groups.map(group => <section key={group.title} className="sbx-section">
        <h2>{group.title}</h2>
        <div className="sbx-table-scroll" role="region" aria-label={group.title} tabIndex={0}>
          <table className="sbx-token-table" aria-label={group.title}>
            <thead><tr>{['CSS variable', 'Mapping', 'Preview'].map(header => <th key={header} scope="col">{header}</th>)}</tr></thead>
            <tbody>{Object.entries(primitiveTokens).filter(([name]) => group.pattern.test(name)).map(([name, value]) => <tr key={name}>
              <td><code>{name}</code></td><td><code>{value}</code></td>
              <td><span className="sbx-type-primitive" style={{ [group.property]: `var(${name})` }}>Build something meaningful.<br />0123456789</span></td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>)}
    </div>
  );
}
