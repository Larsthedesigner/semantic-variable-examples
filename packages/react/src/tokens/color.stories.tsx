import type { Meta, StoryObj } from '@storybook/react';
import { primitiveTokens } from './token-catalog';
import { TokenReference } from './token-reference';


const meta: Meta<typeof TokenReference> = {
  title: 'Foundations/Color',
  component: TokenReference,
  args: { mode: 'light' },
  argTypes: { mode: { control: 'select', options: ['light', 'dark', 'high-contrast'] } },
};
export default meta;
type Story = StoryObj<typeof TokenReference>;

export const Semantics: Story = { args: { category: 'color' } };

export const Primitives: Story = {
  render: () => (
    <div className="sbx-reference">
      <h1>Primitive palette ramps</h1>
      <p>Each family has 12 light-to-dark stops. Blue 800 is Apple system blue #007AFF. Use semantics in application UI.</p>
      {['neutral', 'blue', 'error', 'success', 'warning', 'info'].map(family => (
        <section key={family} className="sbx-section">
          <h2>{family}</h2>
          <div className="sbx-palette-grid">
            {Array.from({ length: 12 }, (_, index) => `--color-${family}-${(index + 1) * 100}`).map(name => (
              <div key={name}>
                <div className="sbx-swatch sbx-swatch--palette" aria-hidden="true">
                  <div className="sbx-swatch__fill" style={{ background: primitiveTokens[name] }} />
                </div>
                <code>{name}<br />{primitiveTokens[name]}</code>
              </div>
            ))}
          </div>
        </section>
      ))}
      <h2>Standalone endpoint</h2><code>--color-white: {primitiveTokens['--color-white']}</code>
    </div>
  ),
};
