import { tokenCatalog } from './token-catalog';
import type { TokenMode } from './token-catalog';

export function TokenReference({ mode = 'light', owner, category }: {
  mode?: TokenMode;
  owner?: string;
  category?: 'color' | 'spacer';
}) {
  const showColorComparison = !owner && category !== 'spacer';
  const tokens = tokenCatalog(showColorComparison ? 'light' : mode, owner).filter(token =>
    !category || (category === 'spacer' ? token.name.startsWith('--system-spacer-') : !token.name.startsWith('--system-spacer-')));
  const darkTokens = new Map(showColorComparison ? tokenCatalog('dark').map(token => [token.name, token]) : []);
  const title = owner ? `${owner} component tokens` : category === 'spacer' ? 'Spacer semantics' : 'Semantic color reference';
  return (
    <div className={['sbx-reference', mode === 'light' ? undefined : mode].filter(Boolean).join(' ')}>
      <h1>{title}</h1>
      <p>Usage describes intent, not a guaranteed contrast ratio. Overlay values must be composited over their actual surface. Literal values have no primitive dependency.</p>
      <div className="sbx-table-scroll" role="region" aria-label={`${title} table`} tabIndex={0}>
      <table className={showColorComparison ? 'sbx-token-table sbx-token-table--comparison' : 'sbx-token-table'} aria-label={title}>
        <colgroup>
          <col className="sbx-token-table__name" />
          {showColorComparison && <>
            <col className="sbx-token-table__preview" />
            <col className="sbx-token-table__preview" />
          </>}
          <col className="sbx-token-table__usage" />
          <col className="sbx-token-table__mapping" />
          <col className="sbx-token-table__value" />
          {!showColorComparison && <col className="sbx-token-table__dependencies" />}
        </colgroup>
        <thead><tr>{(showColorComparison
          ? ['CSS variable', 'Light mode', 'Dark mode', 'Usage', 'Mapping', 'Resolved value (light mode)']
          : ['Token / preview', 'Usage', 'Authored mapping', `Resolved CSS value (${mode})`, 'Primitive dependencies']
        ).map(header => <th key={header} scope="col">{header}</th>)}</tr></thead>
        <tbody>{tokens.map(token => {
          const darkToken = darkTokens.get(token.name);
          if (showColorComparison && !darkToken) throw new Error(`Missing dark-mode token: ${token.name}`);
          return (
          <tr key={token.name}>
            <td>
              <code>{token.name}</code>
              {!showColorComparison && /^#|^rgb|^color-mix/.test(token.value) && (
                <div className="sbx-swatch" aria-hidden="true">
                  <div className="sbx-swatch__fill" style={{ background: `var(${token.name})` }} />
                </div>
              )}
              {token.name.startsWith('--system-spacer-') && <div className="sbx-size-preview" aria-hidden="true" style={{ width: `var(${token.name})` }} />}
            </td>
            {showColorComparison && darkToken && [token.value, darkToken.value].map((value, index) => (
              <td key={index}>
                <div className="sbx-swatch sbx-swatch--square" aria-hidden="true">
                  <div className="sbx-swatch__fill" style={{ background: value }} />
                </div>
              </td>
            ))}
            <td>{token.usage}</td>
            <td><code>{token.expression}</code></td>
            <td><code>{token.value}</code></td>
            {!showColorComparison && <td>{token.primitives.length ? (
              <ul className="sbx-token-list">{token.primitives.map(primitive => <li key={primitive}><code>{primitive}</code></li>)}</ul>
            ) : <code>Literal (no primitive)</code>}</td>}
          </tr>
        ); })}</tbody>
      </table>
      </div>
    </div>
  );
}
