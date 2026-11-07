// @vitest-environment jsdom
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { tokenCatalog } from '../tokens/token-catalog';
import { composeStories } from '@storybook/react';
import * as stories from './card.stories';

const { Settings, Loading } = composeStories(stories);

describe('Card', () => {
  it('is a non-interactive surface without an implied landmark or tab stop', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref} data-testid="card" className="custom"><CardBody>Content</CardBody></Card>);
    const card = screen.getByTestId('card');
    expect(ref.current).toBe(card);
    expect(card).toHaveClass('svx-card', 'custom');
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('tabindex');
    expect(card.tagName).toBe('DIV');
  });
  it('composes semantic markup, explicit heading hierarchy, and optional descriptions', () => {
    render(<Card asChild><article aria-labelledby="title" aria-describedby="description">
      <CardHeader><CardTitle id="title" level={3}>Workspace</CardTitle><CardDescription id="description">Manage your team.</CardDescription></CardHeader>
      <CardBody>Members</CardBody>
    </article></Card>);
    expect(screen.getByRole('article', { name: 'Workspace' })).toHaveAccessibleDescription('Manage your team.');
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass('svx-card__title');
    expect(screen.getByText('Members')).toHaveClass('svx-card__body', 'svx-stack');
  });
  it.each([2, 3, 4, 5, 6] as const)('renders the prescribed h%i heading', level => {
    render(<CardTitle level={level}>Title</CardTitle>);
    expect(screen.getByRole('heading', { level })).toHaveTextContent('Title');
  });
  it('preserves independent header and footer actions and their DOM order', async () => {
    const changed = vi.fn();
    render(<Card>
      <CardHeader actions={<button onClick={changed}>Edit</button>}><CardTitle level={2}>Settings</CardTitle></CardHeader>
      <CardFooter><button>Cancel</button><button>Save</button></CardFooter>
    </Card>);
    expect(screen.getAllByRole('button').map(button => button.textContent)).toEqual(['Edit', 'Cancel', 'Save']);
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(changed).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Cancel' }).parentElement).toHaveAttribute('data-stack-below', 'sm');
  });
  it('forwards refs and native props through each section without changing markup', () => {
    const header = createRef<HTMLDivElement>();
    const title = createRef<HTMLHeadingElement>();
    const description = createRef<HTMLParagraphElement>();
    const body = createRef<HTMLDivElement>();
    const footer = createRef<HTMLDivElement>();
    render(<Card aria-busy>
      <CardHeader ref={header} data-testid="header"><CardTitle ref={title} level={2}>Title</CardTitle><CardDescription ref={description}>Description</CardDescription></CardHeader>
      <CardBody ref={body} data-testid="body">Body</CardBody><CardFooter ref={footer} data-testid="footer">Footer</CardFooter>
    </Card>);
    expect(header.current).toBe(screen.getByTestId('header'));
    expect(title.current).toBe(screen.getByRole('heading'));
    expect(description.current?.tagName).toBe('P');
    expect(body.current).toBe(screen.getByTestId('body'));
    expect(footer.current).toBe(screen.getByTestId('footer'));
    expect(header.current?.parentElement).toHaveAttribute('aria-busy', 'true');
  });
  it.each(['light', 'dark', 'high-contrast'] as const)('resolves component-owned card mappings in %s', mode => {
    const tokens = tokenCatalog(mode, 'card');
    expect(tokens).toHaveLength(7);
    for (const token of tokens) expect(token.value).not.toContain('var(');
    expect(tokens.find(token => token.name.endsWith('padding'))?.value).toBe('1.5rem');
    expect(tokens.find(token => token.name.endsWith('radius'))?.value).toBe('0.5rem');
    expect(tokens.find(token => token.name.endsWith('surface'))?.value)
      .toBe(tokenCatalog(mode).find(token => token.name === '--system-surface-default')?.value);
  });
  it('supports native form submission and reset in the settings composition', async () => {
    render(<Settings />);
    const name = screen.getByRole('textbox', { name: 'Workspace name' });
    await userEvent.clear(name);
    await userEvent.type(name, 'New workspace');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('status')).toHaveTextContent('Settings saved in this example.');
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(name).toHaveValue('Design team');
    expect(screen.getByRole('status')).toHaveTextContent('Changes are not persisted');
  });
  it('lets the loading feature own the named busy region and status', async () => {
    render(<Loading />);
    const card = screen.getByRole('region', { name: 'Workspace details' });
    expect(card).toHaveAttribute('aria-busy', 'true');
    expect(card.querySelector('.svx-skeleton')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Show loaded content' }));
    expect(card).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('Workspace details loaded.');
    expect(card).toHaveTextContent('24 active projects');
  });
});
