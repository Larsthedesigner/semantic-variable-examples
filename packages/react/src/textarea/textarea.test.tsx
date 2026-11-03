// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('forwards native props and ref and merges the shared focus class', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" name="message" required maxLength={100} className="custom" aria-describedby="hint" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('svx-textarea', 'svx-focus-ring', 'custom');
    expect(textarea).toHaveAttribute('data-size', 'md');
    expect(textarea).toHaveAttribute('rows', '3');
    expect(textarea).toHaveAttribute('name', 'message');
    expect(textarea).toHaveAttribute('maxlength', '100');
    expect(textarea).toHaveAttribute('aria-describedby', 'hint');
    expect(textarea).toBeRequired();
    expect(ref.current).toBe(textarea);
  });

  it.each(['sm', 'md', 'lg'] as const)('supports %s sizing and custom rows', (size) => {
    render(<Textarea aria-label="Message" size={size} rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', size);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('supports invalid state and gives explicit aria-invalid precedence', () => {
    const { rerender } = render(<Textarea aria-label="Message" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    rerender(<Textarea aria-label="Message" invalid aria-invalid={false} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  it('supports controlled and uncontrolled multiline editing', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState('');
      return <Textarea aria-label="Message" value={value} onChange={(event) => setValue(event.target.value)} />;
    }
    const { unmount } = render(<Textarea aria-label="Message" defaultValue="First" />);
    await user.type(screen.getByRole('textbox'), '{Enter}Second');
    expect(screen.getByRole('textbox')).toHaveValue('First\nSecond');
    unmount();
    render(<Example />);
    await user.type(screen.getByRole('textbox'), 'First{Enter}Second');
    expect(screen.getByRole('textbox')).toHaveValue('First\nSecond');
  });

  it.each([{ disabled: true }, { readOnly: true }])('prevents editing with %o', async (props) => {
    const onChange = vi.fn();
    render(<Textarea aria-label="Message" defaultValue="Hello" onChange={onChange} {...props} />);
    await userEvent.setup().type(screen.getByRole('textbox'), ' world');
    expect(screen.getByRole('textbox')).toHaveValue('Hello');
    expect(onChange).not.toHaveBeenCalled();
  });
});
