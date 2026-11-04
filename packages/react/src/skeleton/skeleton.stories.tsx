import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Skeleton } from './skeleton';
import { TokenReference } from '../tokens/token-reference';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { variant: 'text', size: 'md', lines: 3 },
  argTypes: {
    variant: { control: 'select', options: ['text', 'rectangle', 'circle'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    lines: { control: { type: 'number', min: 1, step: 1 }, if: { arg: 'variant', eq: 'text' } },
  },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;
export const Default: Story = {};
export const Shapes: Story = {
  render: () => <div style={{ display: 'grid', gap: 'var(--system-spacer-rem-lg)', maxWidth: 400 }}>
    <Skeleton variant="circle" size="lg" />
    <Skeleton variant="text" lines={3} />
    <Skeleton variant="rectangle" style={{ height: 120 }} />
  </div>,
};
export const Themes: Story = {
  render: () => <div style={{ display: 'grid', gap: 'var(--system-spacer-rem-lg)' }}>
    {['light', 'dark', 'high-contrast'].map(mode => <section key={mode} className={`sbx-reference ${mode}`}>
      <h2>{mode}</h2>
      <Skeleton lines={3} />
    </section>)}
  </div>,
};
function LoadingCard() {
  const [loading, setLoading] = useState(true);
  return <div className="sbx-reference">
    <button type="button" onClick={() => setLoading(value => !value)}>{loading ? 'Show loaded content' : 'Show loading state'}</button>
    <p role="status">{loading ? 'Loading account details...' : 'Account details loaded.'}</p>
    <section aria-label="Account details" aria-busy={loading} style={{
      display: 'flex', gap: 'var(--system-spacer-rem-lg)', padding: 'var(--system-spacer-rem-lg)',
      border: '1px solid var(--system-border-default)', borderRadius: 'var(--size-rem-8)', maxWidth: 400,
    }}>
      {loading ? <Skeleton variant="circle" size="lg" /> : <div aria-hidden="true" style={{
        width: '2.5rem', height: '2.5rem', flexShrink: 0, borderRadius: '50%',
        background: 'var(--system-interactive-surface)', display: 'grid', placeItems: 'center',
      }}>JD</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {loading ? <Skeleton lines={3} /> : <div style={{
          font: 'var(--system-type-label-md-font)', display: 'grid', gap: 'var(--component-skeleton-line-gap)',
        }}>
          <span>Jordan Davis</span><span>Workspace administrator</span><span>jordan@example.com</span>
        </div>}
      </div>
    </section>
  </div>;
}
export const AccountCard: Story = { render: () => <LoadingCard /> };
export const Tokens: Story = { render: () => <TokenReference owner="skeleton" /> };
