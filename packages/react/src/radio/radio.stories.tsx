import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio, RadioGroup } from './radio';
import { Label } from '../label/label';
import { SupportingText } from '../supporting-text/supporting-text';
import { TokenReference } from '../tokens/token-reference';
import { Button } from '../button/button';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup', component: RadioGroup, tags: ['autodocs'],
  args: { legend: 'Choose a plan', name: 'plan' },
  argTypes: {
    legend: { control: 'text', description: 'Visible native legend naming the group.', table: { type: { summary: 'ReactNode' } } },
    name: { control: 'text', description: 'Shared native form field name.', table: { type: { summary: 'string' } } },
    value: { control: false, description: 'Controlled selected value.', table: { type: { summary: 'string' } } },
    defaultValue: { control: false, description: 'Initial selected value for uncontrolled use.', table: { type: { summary: 'string' } } },
    size: { control: 'select', options: ['sm', 'md', 'lg'], description: 'Size applied to all options.', table: { type: { summary: "'sm' | 'md' | 'lg'" }, defaultValue: { summary: 'md' } } },
    disabled: { control: 'boolean', description: 'Disable the group and all its options.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    required: { control: 'boolean', description: 'Require one selected option during native form validation.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    invalid: { control: 'boolean', description: 'Expose invalid state on the fieldset and options.', table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    onValueChange: { control: false, description: 'Called with the newly selected value.', table: { type: { summary: '(value: string) => void' } } },
    children: { control: false, description: 'Radio controls, each associated with its own visible label.', table: { type: { summary: 'ReactNode' } } },
  },
  parameters: {
    docs: { description: { component: `RadioGroup renders a native fieldset and legend, shares controlled/uncontrolled selection state, and preserves native form submission.

| Part | Props | Defaults and behavior |
| --- | --- | --- |
| RadioGroup | Native fieldset props; required \`legend\`; optional \`name\`, \`value\`, \`defaultValue\`, \`size\`, \`required\`, \`disabled\`, \`invalid\`, \`onValueChange\` | Size defaults to \`md\`; use either \`value\` with \`onValueChange\` or \`defaultValue\`. |
| Radio | Native input props except type/role/size/checked/readOnly; required \`value\`; optional \`size\`, \`invalid\`, \`onCheckedChange\` | Native radio input; group props override option-level name, selection, and disabled/required states. |

Each Radio needs an individual visible label (for example, wrap it in Label). Set \`aria-describedby\` on the group to associate help and validation text.` } },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;
export const Default: Story = {
  render: args => <RadioGroup {...args}>
    <Label><Radio value="starter" />Starter</Label><Label><Radio value="team" />Team</Label>
    <Label disabled><Radio value="enterprise" disabled />Enterprise (unavailable)</Label>
  </RadioGroup>,
};
export const Disabled: Story = { ...Default, args: { disabled: true, defaultValue: 'starter' } };
export const Validation: Story = {
  render: args => <div style={{ display: 'grid', gap: 'var(--system-spacer-rem-xs)' }}>
    <RadioGroup {...args} required invalid aria-describedby="plan-help plan-error">
      <Label><Radio value="starter" />Starter</Label><Label><Radio value="team" />Team</Label>
    </RadioGroup>
    <SupportingText id="plan-help">Choose one plan for your workspace.</SupportingText>
    <SupportingText id="plan-error" invalid startIcon>Select a plan to continue.</SupportingText>
  </div>,
};
function ControlledPlan() {
  const [value, setValue] = useState('team');
  return <RadioGroup legend="Billing" name="billing" value={value} onValueChange={setValue}>
    <Label><Radio value="monthly" />Monthly</Label><Label><Radio value="team" />Annual</Label>
  </RadioGroup>;
}
export const Controlled: Story = { render: () => <ControlledPlan /> };
function NativeRadioForm() {
  const [submitted, setSubmitted] = useState('');
  return <form style={{ display: 'grid', gap: 'var(--system-spacer-rem-lg)' }}
    onSubmit={event => {
      event.preventDefault();
      setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
    }} onReset={() => setSubmitted('')}>
    <RadioGroup legend="Choose a plan" name="plan" defaultValue="starter" required>
      <Label><Radio value="starter" />Starter</Label><Label><Radio value="team" />Team</Label>
      <Label disabled><Radio value="enterprise" disabled />Enterprise (unavailable)</Label>
    </RadioGroup>
    <div style={{ display: 'flex', gap: 'var(--system-spacer-rem-sm)' }}>
      <Button type="submit">Save plan</Button><Button type="reset">Reset</Button>
    </div>
    <output aria-live="polite">{submitted}</output>
  </form>;
}
export const NativeForm: Story = { render: () => <NativeRadioForm /> };
export const Sizes: Story = {
  render: () => <div style={{ display: 'grid', gap: 'var(--system-spacer-rem-xl)' }}>
    {(['sm', 'md', 'lg'] as const).map(size => <RadioGroup key={size} legend={`${size} options`} size={size} defaultValue="one">
      <Label size={size}><Radio value="one" />First option</Label><Label size={size}><Radio value="two" />Second option</Label>
    </RadioGroup>)}
  </div>,
};
export const Themes: Story = {
  render: () => <div>{['light', 'dark', 'high-contrast'].map(mode => <section key={mode} className={`sbx-reference ${mode}`}>
    <RadioGroup legend={`${mode} options`} defaultValue="one">
      <Label><Radio value="one" />Selected</Label><Label><Radio value="two" />Unselected</Label>
      <Label disabled><Radio value="three" disabled />Disabled</Label>
    </RadioGroup>
  </section>)}</div>,
};
export const Tokens: Story = { render: () => <TokenReference owner="selection-controls" /> };
