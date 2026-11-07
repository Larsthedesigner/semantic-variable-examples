import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './checkbox';
import { Label } from '../label/label';
import { Field, FieldLabel, FieldControl, FieldDescription, FieldError } from '../field/field';
import { TokenReference } from '../tokens/token-reference';
import { Button } from '../button/button';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox', component: Checkbox, tags: ['autodocs'],
  args: { 'aria-label': 'Select item' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    indeterminate: { control: 'boolean' }, disabled: { control: 'boolean' }, invalid: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Checkbox>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
export const Invalid: Story = { args: { invalid: true } };
export const Sizes: Story = {
  render: () => <div style={{ display: 'grid', gap: 'var(--system-spacer-rem-lg)' }}>
    {(['sm', 'md', 'lg'] as const).map(size => <Label key={size} size={size}>
      <Checkbox size={size} defaultChecked />{size} selection
    </Label>)}
  </div>,
};
export const WithField: Story = {
  render: () => <Field required invalid>
    <FieldLabel>Accept the terms</FieldLabel>
    <FieldControl><Checkbox name="terms" value="accepted" /></FieldControl>
    <FieldDescription>Read the agreement before continuing.</FieldDescription>
    <FieldError>Accept the terms to continue.</FieldError>
  </Field>,
};
function SelectAll() {
  const [values, setValues] = useState([true, false, false]);
  const all = values.every(Boolean);
  return <div style={{ display: 'grid', gap: 'var(--system-spacer-rem-md)' }}>
    <Label><Checkbox checked={all} indeterminate={!all && values.some(Boolean)}
      onCheckedChange={checked => setValues(values.map(() => checked))} />Select all projects</Label>
    {values.map((checked, index) => <Label key={index}>
      <Checkbox checked={checked} onCheckedChange={next => setValues(current => current.map((value, i) => i === index ? next : value))} />
      Project {index + 1}
    </Label>)}
  </div>;
}
export const SelectAllProjects: Story = { render: () => <SelectAll /> };
function NativeCheckboxForm() {
  const [submitted, setSubmitted] = useState('');
  return <form style={{ display: 'grid', gap: 'var(--system-spacer-rem-lg)' }}
    onSubmit={event => {
      event.preventDefault();
      setSubmitted(JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))));
    }} onReset={() => setSubmitted('')}>
    <Label required><Checkbox name="terms" value="accepted" required />Accept the terms</Label>
    <Label><Checkbox name="updates" value="subscribed" defaultChecked />Email me product updates</Label>
    <div style={{ display: 'flex', gap: 'var(--system-spacer-rem-sm)' }}>
      <Button type="submit">Save preferences</Button><Button type="reset">Reset</Button>
    </div>
    <output aria-live="polite">{submitted}</output>
  </form>;
}
export const NativeForm: Story = { render: () => <NativeCheckboxForm /> };
export const Themes: Story = {
  render: () => <div>{['light', 'dark', 'high-contrast'].map(mode => <section key={mode} className={`sbx-reference ${mode}`}>
    <h2>{mode}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--system-spacer-rem-lg)' }}>
      <Label><Checkbox />Unchecked</Label><Label><Checkbox defaultChecked />Checked</Label>
      <Label><Checkbox indeterminate />Mixed</Label><Label disabled><Checkbox disabled defaultChecked />Disabled</Label>
      <Label invalid><Checkbox invalid />Invalid</Label>
    </div>
  </section>)}</div>,
};
export const Tokens: Story = { render: () => <TokenReference owner="selection-controls" /> };
