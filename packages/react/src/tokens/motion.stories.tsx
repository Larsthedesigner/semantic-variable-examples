import type { Meta, StoryObj } from '@storybook/react';
import { primitiveTokens } from './token-catalog';
import { ReferenceHeader } from './reference-header';

function Motion() {
  return (
    <div className="sbx-reference">
      <ReferenceHeader
        eyebrow="Foundations / Motion / Primitives"
        title="Motion primitives"
        description="Timing values for short interface transitions. Components retain responsibility for reduced-motion behavior."
      />
      {Object.entries(primitiveTokens).filter(([name]) => name.startsWith('--duration-')).map(([name, value]) => (
        <div key={name} className="sbx-section">
          <code>{name}: {value}</code>
          <p>Duration in milliseconds; use through a semantic motion role.</p>
        </div>
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
