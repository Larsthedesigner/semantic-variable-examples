import type { Meta, StoryObj } from '@storybook/react-vite';
import { primitiveTokens } from './token-catalog';
import { ReferenceHeader } from './reference-header';
import { TokenReference } from './token-reference';

function Motion() {
  return (
    <div className="sbx-reference">
      <ReferenceHeader
        eyebrow="Foundations / Motion / Primitives"
        title="Motion primitives"
        description="Unit-bearing duration and easing primitives for new transitions. The legacy --duration-fast value remains unitless (120 milliseconds) for existing consumers."
      />
      <h2>Durations</h2>
      {Object.entries(primitiveTokens).filter(([name]) => name.startsWith('--duration-')).map(([name, value]) => (
        <div key={name} className="sbx-section">
          <code>{name}: {value}</code>
          <p>{name === '--duration-fast' ? 'Legacy unitless milliseconds value; do not remove or append units.' : 'Use through a semantic motion role.'}</p>
        </div>
      ))}
      <h2>Easing</h2>
      {Object.entries(primitiveTokens).filter(([name]) => name.startsWith('--easing-')).map(([name, value]) => (
        <div key={name} className="sbx-section"><code>{name}: {value}</code></div>
      ))}
    </div>
  );
}
const meta: Meta<typeof Motion> = {
  title: 'Foundations/Motion',
  component: Motion,
};
export default meta;
type Story = StoryObj<typeof Motion>;
export const Primitives: Story = {};
export const Semantics: Story = {
  render: () => <div>
    <TokenReference category="motion" />
    <div className="sbx-reference">
      <p>Shared shimmer utility on a decorative loading surface. Reduced motion leaves a static fill; interactive transitions resolve to zero duration.</p>
      <div className="svx-loading-shimmer" aria-hidden="true" style={{ width: '100%', maxWidth: 400, height: 40 }} />
    </div>
  </div>,
};
