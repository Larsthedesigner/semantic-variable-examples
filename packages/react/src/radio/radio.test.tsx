// @vitest-environment jsdom
import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './radio';
import { Field, FieldLabel, FieldControl, FieldDescription } from '../field/field';

describe('Radio and RadioGroup', () => {
  it('names the native fieldset and individual options and forwards refs', () => {
    const group = createRef<HTMLFieldSetElement>();
    const radio = createRef<HTMLInputElement>();
    render(<RadioGroup legend="Plan" ref={group} name="plan" defaultValue="team">
      <label><Radio ref={radio} value="team" />Team</label>
      <label><Radio value="pro" />Pro</label>
    </RadioGroup>);
    expect(group.current).toBe(screen.getByRole('group', { name: 'Plan' }));
    expect(radio.current).toBe(screen.getByRole('radio', { name: 'Team' }));
    expect(radio.current).toBeChecked();
    expect(radio.current).toHaveAttribute('name', 'plan');
  });
  it('selects one value and supports native arrow-key navigation', async () => {
    const changed = vi.fn();
    render(<RadioGroup legend="Plan" name="plan" defaultValue="team" onValueChange={changed}>
      <label><Radio value="team" />Team</label>
      <label><Radio value="unavailable" disabled />Unavailable</label>
      <label><Radio value="pro" />Pro</label>
    </RadioGroup>);
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Team' })).not.toBeChecked();
    expect(changed).toHaveBeenLastCalledWith('pro');
    expect(changed).toHaveBeenCalledTimes(1);
  });
  it('supports controlled group updates and native form reset for uncontrolled groups', async () => {
    function Controlled() {
      const [value, setValue] = useState('team');
      return <RadioGroup legend="Controlled" value={value} onValueChange={setValue}>
        <label><Radio value="team" />Team</label><label><Radio value="pro" />Pro</label>
      </RadioGroup>;
    }
    const { unmount } = render(<Controlled />);
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    unmount();
    render(<form aria-label="Settings">
      <RadioGroup legend="Plan" name="plan" defaultValue="team" required>
        <label><Radio value="team" />Team</label><label><Radio value="pro" />Pro</label>
      </RadioGroup>
      <button type="reset">Reset</button>
    </form>);
    const form = screen.getByRole('form') as HTMLFormElement;
    await userEvent.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(new FormData(form).get('plan')).toBe('pro');
    await userEvent.click(screen.getByRole('button'));
    expect(new FormData(form).get('plan')).toBe('team');
    expect(form.checkValidity()).toBe(true);
  });
  it('propagates group size, validation, description, and disabled state', async () => {
    const changed = vi.fn();
    const { rerender } = render(<>
      <p id="help">Choose a plan.</p><p id="detail">Extra detail.</p>
      <RadioGroup legend="Plan" size="lg" required invalid aria-describedby="help" onValueChange={changed}>
        <label><Radio value="team" size="sm" aria-describedby="detail help" />Team</label>
      </RadioGroup>
    </>);
    const input = screen.getByRole('radio');
    expect(input).toHaveAccessibleDescription('Choose a plan. Extra detail.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeInvalid();
    expect(input.parentElement).toHaveAttribute('data-size', 'lg');
    rerender(<RadioGroup legend="Plan" disabled onValueChange={changed}><label><Radio value="team" />Team</label></RadioGroup>);
    expect(screen.getByRole('radio')).toBeDisabled();
    await userEvent.click(screen.getByRole('radio'));
    expect(changed).not.toHaveBeenCalled();
  });
  it('generates independent group names and composes a standalone Radio with Field', () => {
    render(<>
      <RadioGroup legend="First"><label><Radio value="a" />A</label></RadioGroup>
      <RadioGroup legend="Second"><label><Radio value="b" />B</label></RadioGroup>
      <Field required size="lg">
        <FieldLabel>Custom</FieldLabel><FieldControl><Radio name="custom" value="custom" /></FieldControl>
        <FieldDescription>Choose this option.</FieldDescription>
      </Field>
    </>);
    const [a, b, custom] = screen.getAllByRole('radio');
    expect(a.getAttribute('name')).not.toBe(b.getAttribute('name'));
    expect(custom).toHaveAccessibleName('Custom');
    expect(custom).toHaveAccessibleDescription('Choose this option.');
    expect(custom).toBeRequired();
    expect(custom.parentElement).toHaveAttribute('data-size', 'lg');
  });
  it('respects option change cancellation and fires callbacks only for selection', async () => {
    const optionChange = vi.fn();
    const groupChange = vi.fn();
    const { unmount } = render(<RadioGroup legend="Plan" onValueChange={groupChange}>
      <label><Radio value="team" onChange={event => event.preventDefault()} onCheckedChange={optionChange} />Team</label>
    </RadioGroup>);
    await userEvent.click(screen.getByRole('radio'));
    expect(optionChange).not.toHaveBeenCalled();
    expect(groupChange).not.toHaveBeenCalled();
    unmount();
    render(<RadioGroup legend="Plan" onValueChange={groupChange}>
      <label><Radio value="team" onCheckedChange={optionChange} />Team</label>
    </RadioGroup>);
    await userEvent.click(screen.getByRole('radio'));
    await userEvent.click(screen.getByRole('radio'));
    expect(optionChange.mock.calls).toEqual([[true]]);
    expect(groupChange.mock.calls).toEqual([['team']]);
  });
  it('keeps selection owned by a controlled group and handles standalone native grouping', async () => {
    const changed = vi.fn();
    const { unmount } = render(<RadioGroup legend="Controlled" value="one" onValueChange={changed}>
      <label><Radio value="one" />One</label><label><Radio value="two" />Two</label>
    </RadioGroup>);
    await userEvent.click(screen.getByRole('radio', { name: 'Two' }));
    expect(changed).toHaveBeenCalledWith('two');
    expect(screen.getByRole('radio', { name: 'One' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Two' })).not.toBeChecked();
    unmount();
    render(<form aria-label="Standalone">
      <label><Radio name="choice" value="one" required />One</label>
      <label><Radio name="choice" value="two" />Two</label>
    </form>);
    const form = screen.getByRole('form') as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    await userEvent.click(screen.getByRole('radio', { name: 'Two' }));
    expect(form.checkValidity()).toBe(true);
    expect(new FormData(form).get('choice')).toBe('two');
  });
});
