import type { Meta, StoryObj } from '@storybook/react';
import { primitiveTokens } from './token-catalog';
import { TokenReference } from './token-reference';

const meta: Meta<typeof TokenReference> = {
  title: 'Foundations/Size',
  component: TokenReference,
  args: { mode: 'light', category: 'spacer' },
  argTypes: { mode: { control: 'select', options: ['light', 'dark', 'high-contrast'] } },
};
export default meta;
type Story = StoryObj<typeof TokenReference>;

export const Semantics: Story = {};
export const Primitives: Story = {
  render: () => (
    <div className="sbx-reference">
      <h1>Size primitives</h1>
      <p>Unit-first names: --size-px-2 and --size-rem-2. Both ramps share the same steps; rem values scale with the root font size.</p>
      <div className="sbx-table-scroll" role="region" aria-label="Size primitives table" tabIndex={0}>
      <table className="sbx-token-table" aria-label="Size primitives">
        <thead><tr>{['Step', 'px token / value', 'rem token / value', 'px preview', 'rem preview'].map(header => <th key={header} scope="col">{header}</th>)}</tr></thead>
        <tbody>{Object.entries(primitiveTokens).filter(([name]) => /^--size-px-\d+$/.test(name)).map(([name, value]) => {
          const rem = name.replace('-px-', '-rem-');
          return (
            <tr key={name}>
              <td>{name.match(/\d+/)?.[0]}</td>
              <td><code>{name}: {value}</code></td>
              <td><code>{rem}: {primitiveTokens[rem]}</code></td>
              {[name, rem].map(token => <td key={token}><div className="sbx-size-preview" aria-hidden="true" style={{ width: `var(${token})` }} /></td>)}
            </tr>
          );
        })}</tbody>
      </table>
      </div>
    </div>
  ),
};
