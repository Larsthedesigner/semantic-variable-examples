import type { Meta, StoryObj } from '@storybook/react-vite';
import { primitiveTokens } from './token-catalog';
import { TokenReference } from './token-reference';
import { ReferenceHeader } from './reference-header';

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
      <ReferenceHeader
        eyebrow="Foundations / Color / Primitives"
        title="Primitive palette ramps"
        description="The raw color vocabulary behind your theme. Follow each ramp from light to dark; use semantic roles in application UI."
        summary="6 families / 12 stops each / Apple blue anchor"
      />
      {['neutral', 'blue', 'error', 'success', 'warning', 'info'].map(family => (
        <section key={family} className="sbx-section">
          <h2>{family}</h2>
          <div className="sbx-palette-scroll" role="region" aria-label={`${family} palette ramp`} tabIndex={0}>
          <div className="sbx-palette-grid">
            {Array.from({ length: 12 }, (_, index) => `--color-${family}-${(index + 1) * 100}`).map(name => (
              <div key={name} className="sbx-palette-stop">
                <div className="sbx-swatch sbx-swatch--palette" aria-hidden="true">
                  <div className="sbx-swatch__fill" style={{ background: primitiveTokens[name] }} />
                </div>
                <code>{name}<br />{primitiveTokens[name]}</code>
                {name === '--color-blue-800' && <span className="sbx-palette-anchor">Apple blue anchor</span>}
              </div>
            ))}
          </div>
          </div>
        </section>
      ))}
      <h2>Standalone endpoint</h2><code>--color-white: {primitiveTokens['--color-white']}</code>
    </div>
  ),
};
