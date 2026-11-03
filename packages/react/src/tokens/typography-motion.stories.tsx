import type { Meta, StoryObj } from '@storybook/react';
import { primitiveTokens } from './token-catalog';

function TypographyAndMotion() {
  return (
    <div className="sbx-reference">
      <h1>Typography and motion primitives</h1>
      {Object.entries(primitiveTokens).filter(([name]) => /^--(font|line-height|duration)-/.test(name)).map(([name, value]) => (
        <div key={name} className="sbx-section">
          <code>{name}: {value}</code>
          {name.startsWith('--font-size-') && <p style={{ fontSize: `var(${name})` }}>The quick brown fox jumps over the lazy dog.</p>}
          {name.startsWith('--line-height-') && <p style={{ lineHeight: `var(${name})` }}>Line-height sample<br />Second line</p>}
          {name.startsWith('--duration-') && <p>Duration in milliseconds; use through a semantic motion role.</p>}
        </div>
      ))}
    </div>
  );
}
const meta: Meta<typeof TypographyAndMotion> = {
  title: 'Foundations/Typography And Motion',
  component: TypographyAndMotion,
};
export default meta;
type Story = StoryObj<typeof TypographyAndMotion>;
export const Primitives: Story = {};
