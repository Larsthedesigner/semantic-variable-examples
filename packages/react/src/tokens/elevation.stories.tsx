import type { Meta, StoryObj } from '@storybook/react-vite';
import { TokenReference } from './token-reference';

function Elevation({ mode = 'light' }: { mode?: 'light' | 'dark' | 'high-contrast' }) {
  const surfaces = [
    ['Raised', '--system-elevation-raised'],
    ['Overlay', '--system-elevation-overlay'],
    ['Floating', '--system-elevation-floating'],
  ] as const;
  return (
    <div className={`sbx-reference ${mode}`} style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '2rem', background: 'var(--system-surface-default)' }}>
        {surfaces.map(([label, token]) => (
          <div key={token} style={{
            minWidth: '8rem',
            padding: '1rem',
            border: '1px solid var(--system-border-default)',
            borderRadius: 'var(--system-radius-md)',
            background: 'var(--system-surface-overlay)',
            boxShadow: `var(${token})`,
            color: 'var(--system-text-primary)',
          }}>
            <strong>{label}</strong>
            <br />
            <code>{token}</code>
          </div>
        ))}
      </div>
      <TokenReference category="elevation" mode={mode} />
    </div>
  );
}

const meta = {
  title: 'Foundations/Elevation',
  component: Elevation,
  args: { mode: 'light' },
  argTypes: {
    mode: { control: 'select', options: ['light', 'dark', 'high-contrast'] },
  },
} satisfies Meta<typeof Elevation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Semantics: Story = {};
