import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Skeleton } from './skeleton';
import { TokenReference } from '../tokens/token-reference';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: { variant: 'text', size: 'md', lines: 3 },
  argTypes: {
    variant: {
      control: 'select', options: ['text', 'rectangle', 'circle'],
      description: 'Placeholder shape. Only the text variant accepts lines.',
      table: { type: { summary: "'text' | 'rectangle' | 'circle'" }, defaultValue: { summary: 'text' } },
    },
    size: {
      control: 'select', options: ['sm', 'md', 'lg'],
      description: 'Placeholder size.',
      table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } },
    },
    lines: {
      control: { type: 'number', min: 1, step: 1 }, if: { arg: 'variant', eq: 'text' },
      description: 'Positive integer count of text lines. Only valid with variant="text"; invalid counts throw a RangeError.',
      table: { type: { summary: 'number (text variant only)' }, defaultValue: { summary: '1' } },
    },
    className: {
      control: false, description: 'Additional CSS class names on the placeholder div.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: false, description: 'Native div styles, for example width or height for a rectangular placeholder.',
      table: { type: { summary: 'CSSProperties' } },
    },
  },
  parameters: {
    docs: { description: { component: 'Skeleton accepts native div props except children and dangerouslySetInnerHTML. It is always aria-hidden and inert; supply loading announcements and aria-busy on the surrounding content, as shown in Account Card. Defaults below describe the component, not the example, which starts with three lines.' } },
  },
};
export default meta;
type Story = StoryObj<typeof Skeleton>;
export const Default: Story = {};
export const Shapes: Story = {
  argTypes: {
    variant: { control: false },
    size: { control: false },
  },
  render: ({ lines }) => <div style={{ display: 'grid', gap: 'var(--system-spacer-rem-lg)', maxWidth: 400 }}>
    <Skeleton variant="circle" size="lg" />
    <Skeleton variant="text" lines={lines} />
    <Skeleton variant="rectangle" style={{ height: 120 }} />
  </div>,
  parameters: {
    docs: { description: { story: 'A fixed shape comparison. Variant and size are disabled because each specimen sets them explicitly; lines controls the text specimen.' } },
  },
};
export const Themes: Story = {
  render: ({ lines }) => <div style={{ display: 'grid', gap: 'var(--system-spacer-rem-lg)' }}>
    {['light', 'dark', 'high-contrast'].map(mode => <section key={mode} className={`sbx-reference ${mode}`}>
      <h2>{mode}</h2>
      <Skeleton lines={lines} />
    </section>)}
  </div>,
  argTypes: {
    variant: { control: false },
    size: { control: false },
  },
  parameters: {
    docs: { description: { story: 'A fixed theme comparison. Variant and size are disabled because the examples use the same text skeleton in each theme.' } },
  },
};
function LoadingCard() {
  const [loading, setLoading] = useState(true);
  return <div className="sbx-reference">
    <button type="button" onClick={() => setLoading(value => !value)}>{loading ? 'Show loaded content' : 'Show loading state'}</button>
    <p role="status">{loading ? 'Loading account details...' : 'Account details loaded.'}</p>
    <section aria-label="Account details" aria-busy={loading} style={{
      display: 'flex', gap: 'var(--system-spacer-rem-lg)', padding: 'var(--system-spacer-rem-lg)',
      border: '1px solid var(--system-border-default)', borderRadius: 'var(--system-radius-md)', maxWidth: 400,
    }}>
      {loading ? <Skeleton variant="circle" size="lg" /> : <div aria-hidden="true" style={{
        width: '2.5rem', height: '2.5rem', flexShrink: 0, borderRadius: 'var(--system-radius-full)',
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
export const AccountCard: Story = {
  render: () => <LoadingCard />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'The loading state is controlled by the button inside the example, so Skeleton component controls do not apply.' } },
  },
};
export const Tokens: Story = {
  render: () => <TokenReference owner="skeleton" />,
  parameters: {
    controls: { disable: true },
    docs: { description: { story: 'Reference-only view of Skeleton design tokens. This story renders TokenReference rather than a Skeleton, so component controls do not apply.' } },
  },
};
