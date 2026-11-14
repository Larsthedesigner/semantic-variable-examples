// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuItem, MenuLabel,
  MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuSub, MenuSubContent,
  MenuSubTrigger, MenuTrigger,
} from './menu';

beforeAll(() => {
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', MockResizeObserver);
  Element.prototype.scrollIntoView ??= () => {};
});

describe('Menu', () => {
  it('forwards trigger props, class and ref while closed', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Menu>
        <MenuTrigger ref={ref} className="custom-trigger" aria-label="Project actions" disabled>
          Actions
        </MenuTrigger>
        <MenuContent><MenuItem>Duplicate</MenuItem></MenuContent>
      </Menu>,
    );

    const trigger = screen.getByRole('button', { name: 'Project actions' });
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveClass('custom-trigger');
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('portals content and forwards content and item props, classes and refs', () => {
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();
    const { container } = render(
      <Menu defaultOpen dir="rtl">
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent
          ref={contentRef}
          className="custom-content"
          aria-label="Project actions"
          data-project="atlas"
          side="top"
          align="end"
          avoidCollisions={false}
        >
          <MenuItem ref={itemRef} className="custom-item" data-action="duplicate" textValue="Copy">
            Duplicate
          </MenuItem>
          <MenuItem disabled>Delete</MenuItem>
        </MenuContent>
      </Menu>,
    );

    const content = screen.getByRole('menu', { name: 'Actions' });
    expect(container).not.toContainElement(content);
    expect(contentRef.current).toBe(content);
    expect(content).toHaveClass('svx-menu-content', 'custom-content');
    expect(content).toHaveAttribute('data-project', 'atlas');
    expect(content).toHaveAttribute('aria-label', 'Project actions');
    expect(content).toHaveAttribute('data-side', 'top');
    expect(content).toHaveAttribute('data-align', 'end');
    expect(content).toHaveAttribute('dir', 'rtl');
    const item = screen.getByRole('menuitem', { name: 'Duplicate' });
    expect(itemRef.current).toBe(item);
    expect(item).toHaveClass('svx-menu-item', 'custom-item');
    expect(item).toHaveAttribute('data-action', 'duplicate');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('merges asChild props, classes and refs onto custom elements', () => {
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();
    const itemRef = vi.fn<(node: HTMLElement | null) => void>();
    render(
      <Menu defaultOpen modal={false}>
        <MenuTrigger asChild ref={triggerRef}><button className="child-trigger">Actions</button></MenuTrigger>
        <MenuContent asChild ref={contentRef} className="custom-content">
          <section className="child-content">
            <MenuItem asChild ref={itemRef} className="custom-item">
              <a href="/projects/atlas" className="child-item">Open project</a>
            </MenuItem>
          </section>
        </MenuContent>
      </Menu>,
    );

    expect(triggerRef.current).toBe(screen.getByRole('button', { name: 'Actions' }));
    expect(triggerRef.current).toHaveClass('child-trigger');
    expect(contentRef.current).toBe(screen.getByRole('menu'));
    expect(contentRef.current?.tagName).toBe('SECTION');
    expect(contentRef.current).toHaveClass('svx-menu-content', 'custom-content', 'child-content');
    const item = screen.getByRole('menuitem', { name: 'Open project' });
    expect(itemRef).toHaveBeenLastCalledWith(item);
    expect(item).toHaveAttribute('href', '/projects/atlas');
    expect(item).toHaveClass('svx-menu-item', 'custom-item', 'child-item');
  });

  it('requests a controlled open state change from the trigger keyboard handler', () => {
    const onOpenChange = vi.fn();
    render(
      <Menu open={false} onOpenChange={onOpenChange}>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent><MenuItem>Duplicate</MenuItem></MenuContent>
      </Menu>,
    );

    const trigger = screen.getByRole('button', { name: 'Actions' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keeps content open when onSelect prevents default and does not select disabled items', () => {
    const onDisabledSelect = vi.fn();
    const onSelect = vi.fn((event: Event) => event.preventDefault());
    render(
      <Menu defaultOpen>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onSelect={onSelect}>Duplicate</MenuItem>
          <MenuItem disabled onSelect={onDisabledSelect}>Delete</MenuItem>
        </MenuContent>
      </Menu>,
    );

    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onDisabledSelect).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(expect.any(Event));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('forwards a cancellable Escape callback without dismissing controlled content', () => {
    const onOpenChange = vi.fn();
    const onEscapeKeyDown = vi.fn((event: KeyboardEvent) => event.preventDefault());
    render(
      <Menu open onOpenChange={onOpenChange} modal={false}>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent onEscapeKeyDown={onEscapeKeyDown}>
          <MenuItem>Duplicate</MenuItem>
        </MenuContent>
      </Menu>
    );
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });
    expect(onEscapeKeyDown).toHaveBeenCalledOnce();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders labelled groups, separators, and accessible checkbox and radio items', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Options</MenuTrigger>
        <MenuContent>
          <MenuLabel>Visibility</MenuLabel>
          <MenuGroup>
            <MenuCheckboxItem checked>Show hidden files</MenuCheckboxItem>
            <MenuCheckboxItem checked="indeterminate">Partially selected</MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuLabel>Sort by</MenuLabel>
          <MenuRadioGroup value="name" onValueChange={() => {}}>
            <MenuRadioItem value="name">Name</MenuRadioItem>
            <MenuRadioItem value="date">Date modified</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>,
    );

    expect(screen.getByText('Visibility')).toHaveClass('svx-menu-label');
    expect(screen.getByRole('separator')).toHaveClass('svx-menu-separator');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Show hidden files' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemcheckbox', { name: 'Partially selected' })).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByText('−')).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: 'Date modified' })).toHaveAttribute('aria-checked', 'false');
  });

  it('renders open submenu content with menu semantics and forwarded classes', () => {
    render(
      <Menu defaultOpen>
        <MenuTrigger>Options</MenuTrigger>
        <MenuContent>
          <MenuSub open>
            <MenuSubTrigger>More options</MenuSubTrigger>
            <MenuSubContent className="custom-subcontent">
              <MenuItem>Open in new tab</MenuItem>
            </MenuSubContent>
          </MenuSub>
        </MenuContent>
      </Menu>,
    );

    expect(screen.getByRole('menuitem', { name: 'More options' })).toHaveAttribute('aria-haspopup', 'menu');
    expect(screen.getByRole('menuitem', { name: 'Open in new tab' })).toBeVisible();
    expect(screen.getAllByRole('menu')).toHaveLength(2);
    expect(screen.getAllByRole('menu')[1]).toHaveClass('svx-menu-content', 'custom-subcontent');
  });
});
