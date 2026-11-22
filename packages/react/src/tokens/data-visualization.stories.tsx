import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

type Mode = 'light' | 'dark' | 'high-contrast';

const categories = [
  'Discovery',
  'Planning',
  'In progress',
  'Review',
  'Complete',
  'Blocked',
  'Other',
];
const sequential = Array.from({ length: 6 }, (_, index) => index + 1);
const diverging = [
  'negative-3',
  'negative-2',
  'negative-1',
  'neutral',
  'positive-1',
  'positive-2',
  'positive-3',
];
const examples = [
  { label: 'Discovery', value: 18, category: 1 },
  { label: 'Planning', value: 12, category: 2 },
  { label: 'In progress', value: 26, category: 3 },
  { label: 'Complete', value: 31, category: 5 },
];

function swatchStyle(token: string): CSSProperties {
  return { backgroundColor: `var(${token})` };
}

export function DataVisualization({ mode = 'light' }: { mode?: Mode }) {
  return (
    <div className={`sbx-reference ${mode}`} style={{ padding: '1.5rem' }}>
      <header>
        <p>Foundations / Data visualization</p>
        <h1>Data-visualization color roles</h1>
        <p>
          Theme-aware colors for series, ordered values, diverging values, and
          chart scaffolding. Keep labels and data alternatives alongside color.
        </p>
      </header>

      <section>
        <h2>Categorical series</h2>
        <p>
          Seven series swatches. The marker shapes below are examples; chart
          implementations should pair color with visible labels and another
          channel such as shape, line style, or pattern.
        </p>
        <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', listStyle: 'none', padding: 0 }}>
          {categories.map((label, index) => {
            const token = `--system-data-viz-categorical-${index + 1}`;
            return (
              <li key={token} style={{ alignItems: 'center', display: 'flex', gap: '0.5rem' }}>
                <span
                  aria-hidden="true"
                  style={{
                    ...swatchStyle(token),
                    borderRadius: index % 2 === 0 ? '50%' : '2px',
                    display: 'inline-block',
                    height: '1rem',
                    transform: index === 3 ? 'rotate(45deg)' : undefined,
                    width: '1rem',
                  }}
                />
                <span>{label}</span>
                <code style={{ fontSize: '0.75rem' }}>Series {index + 1}</code>
              </li>
            );
          })}
        </ul>

        <h3>Example with labels and a data table</h3>
        <figure>
          <figcaption>Sample work items by stage</figcaption>
          <div
            aria-label="Sample work items by stage: Discovery 18, Planning 12, In progress 26, Complete 31."
            role="img"
            style={{ display: 'grid', gap: '0.5rem', marginBlock: '1rem', maxWidth: '34rem' }}
          >
            {examples.map(({ label, value, category }) => (
              <div key={label} style={{ alignItems: 'center', display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: 'var(--system-data-viz-axis-text)', minWidth: '7rem' }}>{label}</span>
                <div
                  aria-hidden="true"
                  style={{
                    ...swatchStyle(`--system-data-viz-categorical-${category}`),
                    borderRadius: 'var(--system-radius-xs)',
                    height: '1rem',
                    width: `${value * 3}px`,
                  }}
                />
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <details>
            <summary>View data table</summary>
            <table>
              <caption>Sample work items by stage</caption>
              <thead>
                <tr><th scope="col">Stage</th><th scope="col">Work items</th></tr>
              </thead>
              <tbody>
                {examples.map(({ label, value }) => (
                  <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>
                ))}
              </tbody>
            </table>
          </details>
        </figure>
      </section>

      <section>
        <h2>Sequential scale</h2>
        <p>Read from lower to higher values. These six steps are ordered, not guaranteed to be perceptually equal.</p>
        <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
          {sequential.map(step => {
            const token = `--system-data-viz-sequential-${step}`;
            return (
              <li key={token} style={{ display: 'grid', gap: '0.25rem', textAlign: 'center' }}>
                <span aria-hidden="true" style={{ ...swatchStyle(token), height: '2.5rem', width: '4rem' }} />
                <code>Step {step}</code>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h2>Diverging scale</h2>
        <p>Blue and amber distinguish values on either side of an explicitly labelled neutral midpoint.</p>
        <ol style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', listStyle: 'none', padding: 0 }}>
          {diverging.map(step => {
            const token = `--system-data-viz-diverging-${step}`;
            return (
              <li key={token} style={{ display: 'grid', gap: '0.25rem', textAlign: 'center' }}>
                <span aria-hidden="true" style={{ ...swatchStyle(token), height: '2.5rem', width: '4rem' }} />
                <code>{step}</code>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <h2>Chart scaffolding</h2>
        <div
          style={{
            background: 'var(--system-surface-default)',
            borderBlockStart: '1px solid var(--system-data-viz-gridline)',
            color: 'var(--system-data-viz-axis-text)',
            maxWidth: '34rem',
            padding: '1rem',
          }}
        >
          <p>Axis text uses a readable text role; gridlines stay supplementary.</p>
          <hr style={{ border: 0, borderBlockStart: '2px solid var(--system-data-viz-reference-line)' }} />
          <p>Reference line: target</p>
        </div>
        <p>
          Token roles:{' '}
          <code>--system-data-viz-gridline</code>,{' '}
          <code>--system-data-viz-axis-text</code>, and{' '}
          <code>--system-data-viz-reference-line</code>.
        </p>
      </section>
    </div>
  );
}

const meta = {
  title: 'Foundations/Data visualization',
  component: DataVisualization,
  args: { mode: 'light' },
  argTypes: {
    mode: { control: 'select', options: ['light', 'dark', 'high-contrast'] },
  },
} satisfies Meta<typeof DataVisualization>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ColorRoles: Story = {};
