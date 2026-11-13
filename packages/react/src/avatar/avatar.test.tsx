// @vitest-environment jsdom
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './avatar';
import { tokenCatalog } from '../tokens/token-catalog';

describe('Avatar', () => {
  it('shows initials and provides an accessible name by default', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('uses an image with an empty alt when a source is provided', () => {
    render(<Avatar name="Ada Lovelace" src="/ada.png" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' }).querySelector('img')).toHaveAttribute('alt', '');
  });

  it('shows initials if the image fails to load', () => {
    render(<Avatar name="Ada Lovelace" src="/missing.png" />);
    fireEvent.error(screen.getByRole('img', { name: 'Ada Lovelace' }).querySelector('img')!);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('supports custom fallback content and an explicitly supplied accessible name', () => {
    render(<Avatar name="Ada Lovelace" aria-label="Profile photo for Ada" fallback={<b>?</b>} />);
    expect(screen.getByRole('img', { name: 'Profile photo for Ada' })).toHaveTextContent('?');
  });

  it.each(['sm', 'md', 'lg'] as const)('supports the %s size', (size) => {
    render(<Avatar name="Ada Lovelace" size={size} />);
    expect(screen.getByRole('img')).toHaveClass(`svx-avatar--${size}`);
    expect(screen.getByRole('img')).toHaveAttribute('data-size', size);
  });

  it('forwards refs, native attributes, and custom classes', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="Ada Lovelace" id="avatar" className="custom" />);
    expect(ref.current).toBe(screen.getByRole('img'));
    expect(ref.current).toHaveAttribute('id', 'avatar');
    expect(ref.current).toHaveClass('svx-avatar', 'custom');
  });

  it('rejects an empty accessible name', () => {
    expect(() => render(<Avatar name="  " />)).toThrow('Avatar name must not be empty');
  });

  it.each(['light', 'dark', 'high-contrast'] as const)('resolves neutral fallback mappings in %s', (mode) => {
    const avatarTokens = tokenCatalog(mode, 'avatar');
    const systemTokens = tokenCatalog(mode);
    for (const token of avatarTokens) expect(token.value).not.toContain('var(');
    for (const role of ['surface', 'fg'] as const) {
      expect(avatarTokens.find(token => token.name === `--component-avatar-${role === 'fg' ? 'foreground' : role}`)?.value)
        .toBe(systemTokens.find(token => token.name === `--system-status-neutral-${role}`)?.value);
    }
  });
});
