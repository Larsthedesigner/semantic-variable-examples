import { useState } from 'react';
import { tokenCatalog } from './token-catalog';
import type { TokenMode } from './token-catalog';
import { ReferenceHeader } from './reference-header';

const colorGroups = [
  { id: 'surfaces', title: 'Surfaces', description: 'Build depth and structure with fills for content, panels, and elevated regions.', pattern: /^--system-(?:(surface|deep)-|scrim$)/ },
  { id: 'foregrounds', title: 'Text & icons', description: 'Choose content emphasis and foreground roles for the surface underneath.', pattern: /^--system-(text|icon)-/ },
  { id: 'loading', title: 'Loading', description: 'Reserve pending content with neutral placeholder fills and shimmer overlays.', pattern: /^--system-loading-/ },
  { id: 'borders', title: 'Borders & focus', description: 'Define boundaries and visible focus indicators.', pattern: /^--system-border-|^--system-interactive-focus-ring$/ },
  { id: 'interactive', title: 'Interactive', description: 'Pair action fills and foregrounds across hover, pressed, selected, and disabled states.', pattern: /^--system-interactive-(?!focus-ring$)/ },
  { id: 'data-viz', title: 'Data visualization', description: 'Use categorical, ordered, and diverging roles with chart labels and non-color alternatives.', pattern: /^--system-data-viz-/ },
  ...['error', 'success', 'warning', 'info', 'neutral'].map(status => ({
    id: status,
    title: `${status[0].toUpperCase()}${status.slice(1)} feedback`,
    description: `Use coordinated ${status} fills, foregrounds, and borders to communicate state.`,
    pattern: new RegExp(`^--system-status-${status}-`),
  })),
  { id: 'status', title: 'Shared status roles', description: 'Apply common emphasis and disabled treatments to status content.', pattern: /^--system-status-(?!(error|success|warning|info|neutral)-)/ },
];

export function TokenReference({ mode = 'light', owner, category }: {
  mode?: TokenMode;
  owner?: string;
  category?: 'color' | 'spacer' | 'animation' | 'motion' | 'layout' | 'radius' | 'elevation' | 'layering';
}) {
  const [activeGroup, setActiveGroup] = useState('all');
  const showColorComparison = !owner && (category === undefined || category === 'color');
  const isMotion = category === 'animation' || category === 'motion';
  const tokens = tokenCatalog(showColorComparison ? 'light' : mode, owner).filter(token => {
    if (owner) return true;
    if (category === 'spacer') return token.name.startsWith('--system-spacer-');
    if (isMotion) return token.name.startsWith('--system-motion-') || token.name.startsWith('--system-animation-');
    if (category === 'layout') return token.name.startsWith('--system-layout-');
    if (category === 'radius') return token.name.startsWith('--system-radius-');
    if (category === 'elevation') return token.name.startsWith('--system-elevation-');
    if (category === 'layering') return token.name.startsWith('--system-layer-');
    return !/^--system-(spacer|type|animation|motion|layout|radius|elevation|layer)-/.test(token.name);
  });
  const darkTokens = new Map(showColorComparison ? tokenCatalog('dark').map(token => [token.name, token]) : []);
  const title = owner ? `${owner} component tokens` : category === 'spacer' ? 'Spacer semantics' : isMotion ? 'Motion semantics' : category === 'layout' ? 'Layout semantics' : category === 'radius' ? 'Radius semantics' : category === 'elevation' ? 'Elevation semantics' : category === 'layering' ? 'Layering semantics' : 'Semantic color reference';
  const groups = showColorComparison ? colorGroups.map(group => ({
    ...group, tokens: tokens.filter(token => group.pattern.test(token.name)),
  })).filter(group => group.tokens.length) : [{ id: 'tokens', title, description: '', tokens }];
  if (showColorComparison && tokens.some(token => colorGroups.filter(group => group.pattern.test(token.name)).length !== 1)) {
    throw new Error('Every color semantic must belong to exactly one reference group');
  }
  const visibleTokens = showColorComparison && activeGroup !== 'all'
    ? groups.filter(group => group.id === activeGroup).flatMap(group => group.tokens)
    : tokens;
  return (
    <div className={`sbx-reference ${mode}`}>
      <ReferenceHeader
        eyebrow={owner ? 'Components / Token reference' : `Foundations / ${category === 'spacer' ? 'Size' : isMotion ? 'Motion' : category === 'layout' ? 'Layout' : category === 'radius' ? 'Radius' : category === 'elevation' ? 'Elevation' : category === 'layering' ? 'Layering' : 'Color'} / Semantics`}
        title={title}
        description={showColorComparison
          ? 'Choose colors by purpose, not palette. Compare each role in light and dark mode before using it in your application.'
          : category === 'spacer' ? 'A shared spacing rhythm for gaps, padding, and margins. Use rem for scalable layouts and px for fixed geometry.'
          : isMotion ? 'Use unit-bearing duration and easing semantics for new transitions. The legacy --duration-fast and --motion-interactive mappings stay unitless for compatibility; reduced motion removes transitions and persistent loading animation while retaining static feedback.'
          : category === 'layout' ? 'Parent fill, viewport fit, bounded content widths, and page gutters. Percentages follow the parent; viewport units follow the iframe viewport.'
          : category === 'radius' ? 'Shared corner sizes, from square to pill. T-shirt values scale with root text size; full uses 50% and makes a circle only on a square box.'
          : category === 'elevation' ? 'Pair raised, overlay, and floating shadows with their intended surfaces. The roles remain stable across themes; borders provide separation when forced-colors suppresses shadows.'
          : category === 'layering' ? 'Global stack levels order sticky chrome, transient surfaces, modal backdrops and content, tooltips, and the reserved toast layer. Local control stacking is independent, and stacking contexts can constrain descendants.'
          : 'Component-owned mappings connect theme roles and primitive dimensions to the control.'}
        summary={`${tokens.length} tokens${showColorComparison ? ` / ${groups.length} groups / Light + dark` : ` / ${mode} mode`}`}
      />
      {showColorComparison && <div className="sbx-filter-bar" role="group" aria-label="Filter color semantics">
        <button type="button" aria-pressed={activeGroup === 'all'} onClick={() => setActiveGroup('all')}>All<span>{tokens.length}</span></button>
        {groups.map(group => <button type="button" key={group.id} aria-pressed={activeGroup === group.id} onClick={() => setActiveGroup(group.id)}>{group.title}<span>{group.tokens.length}</span></button>)}
      </div>}
      {showColorComparison && <p className="sbx-filter-results" role="status">{visibleTokens.length} of {tokens.length} tokens</p>}
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
        <tbody>{visibleTokens.map(token => {
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
              {token.name.startsWith('--system-radius-') && <div aria-hidden="true" style={{
                width: '4rem', height: '2.5rem', marginBlockStart: 'var(--system-spacer-rem-sm)',
                border: '1px solid var(--system-border-control)', background: 'var(--system-surface-sunken-soft)',
                borderRadius: `var(${token.name})`,
              }} />}
            </td>
            {showColorComparison && darkToken && [token.value, darkToken.value].map((value, index) => (
              <td key={index} className="sbx-preview-cell">
                <div className="sbx-swatch sbx-swatch--square" style={{ background: value }} aria-hidden="true" />
              </td>
            ))}
            <td className="sbx-token-usage">{token.usage}</td>
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
