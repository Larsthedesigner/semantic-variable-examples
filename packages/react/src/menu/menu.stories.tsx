import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../button/button';
import { Menu, MenuContent, MenuItem, MenuTrigger } from './menu';

type MenuStoryArgs = ComponentProps<typeof Menu> &
  Pick<ComponentProps<typeof MenuContent>, 'side' | 'sideOffset' | 'align' | 'alignOffset' | 'loop'> & {
    triggerLabel: string;
    triggerDisabled: boolean;
    itemDisabled: boolean;
    keepOpenOnSelect: boolean;
  };

function MenuExample({
  modal, dir, side, sideOffset, align, alignOffset, loop,
  triggerLabel, triggerDisabled, itemDisabled, keepOpenOnSelect,
  open, onOpenChange,
}: MenuStoryArgs) {
  const [selected, setSelected] = useState('None');
  const select = (label: string) => (event: Event) => {
    if (keepOpenOnSelect) event.preventDefault();
    setSelected(label);
  };
  return (
    <div>
      <Menu modal={modal} dir={dir} open={open} onOpenChange={onOpenChange}>
        <MenuTrigger asChild disabled={triggerDisabled}>
          <Button>{triggerLabel}</Button>
        </MenuTrigger>
        <MenuContent side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} loop={loop}>
          <MenuItem onSelect={select('Duplicate')}>Duplicate</MenuItem>
          <MenuItem disabled={itemDisabled} onSelect={select('Delete')}>Delete</MenuItem>
          <MenuItem onSelect={select('Archive')}>Archive</MenuItem>
        </MenuContent>
      </Menu>
      <p role="status">Last action: {selected}</p>
    </div>
  );
}

function ControlledExample(args: MenuStoryArgs) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p>Controlled state: {open ? 'open' : 'closed'}</p>
      <MenuExample {...args} open={open} onOpenChange={setOpen} />
    </div>
  );
}

const api = `
A token-styled Radix DropdownMenu. Compose the four exported parts; MenuContent
portals to document.body automatically. No separate MenuPortal, checkbox/radio
items, groups, or submenu wrappers are exported.

The controls below configure this composition. triggerLabel, triggerDisabled,
itemDisabled, and keepOpenOnSelect are **story-only arguments**, not Menu props.
The remaining controls map to the root or content as described.

### Menu

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| children | ReactNode | - | Trigger and content composition. |
| open | boolean | - | Controlled open state; pair with onOpenChange. |
| defaultOpen | boolean | false | Initial uncontrolled open state. |
| onOpenChange | (open: boolean) => void | - | Called when an interaction requests an open-state change. |
| modal | boolean | true | Modal focus, outside-interaction, and scroll behavior. |
| dir | 'ltr' or 'rtl' | inherited direction / ltr | Reading direction and logical positioning. |

### MenuTrigger

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| children | ReactNode | - | Accessible trigger label, or one child when asChild is true. |
| asChild | boolean | false | Merge behavior onto one ref-forwarding child; use Button rather than nesting buttons. |
| disabled | boolean | false | Prevent opening from this trigger. |
| className | string | - | Additional classes; no Menu-specific trigger class is added. |
| ref | \`Ref<HTMLButtonElement>\` | - | Forwarded to the trigger; asChild renders the child element. |
| button attributes / events | \`ComponentPropsWithoutRef<'button'>\` | - | Native attributes and handlers, including aria-label, id, onClick and onKeyDown. |

### MenuContent

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| children | ReactNode | - | Menu items. |
| asChild | boolean | false | Merge content behavior and styles onto one ref-forwarding child. |
| className | string | - | Merged with svx-menu-content. |
| ref | \`Ref<HTMLDivElement>\` | - | Forwarded to the content, not the portal or positioning wrapper. |
| side | 'top', 'right', 'bottom', 'left' | bottom | Preferred side; collision handling can change the resolved side. |
| sideOffset | number | 4 | Distance from the trigger in pixels; zero is supported. |
| align | 'start', 'center', 'end' | center | Preferred alignment relative to the trigger. |
| alignOffset | number | 0 | Alignment adjustment in pixels. |
| avoidCollisions | boolean | true | Reposition to remain inside the collision boundary. |
| collisionBoundary | \`Element, null, or Array<Element or null>\` | [] | Additional collision boundaries. |
| collisionPadding | \`number or Partial<Record<Side, number>>\` | 0 | Padding inside the collision boundary; Side is top/right/bottom/left. |
| sticky | 'partial' or 'always' | partial | Positioning behavior near the boundary. |
| hideWhenDetached | boolean | false | Hide content when its trigger is fully occluded. |
| arrowPadding | number | 0 | Inherited Radix arrow clearance; no arrow wrapper is exported. |
| loop | boolean | false | Wrap keyboard navigation between the first and last enabled item. |
| forceMount | true | - | Inherited content presence flag, not a portal prop. The wrapper's internal Portal still follows root presence. |
| onCloseAutoFocus | (event: Event) => void | - | Called before restoring focus; preventDefault overrides restoration. |
| onEscapeKeyDown | (event: KeyboardEvent) => void | - | Called on Escape; preventDefault cancels dismissal. |
| onPointerDownOutside | (event: PointerDownOutsideEvent) => void | - | Cancellable outside pointer interaction; original event is in event.detail.originalEvent. |
| onFocusOutside | (event: FocusOutsideEvent) => void | - | Cancellable outside focus interaction. |
| onInteractOutside | (event: PointerDownOutsideEvent or FocusOutsideEvent) => void | - | Cancellable outside pointer or focus interaction. |
| div attributes / events | \`ComponentPropsWithoutRef<'div'>\` | - | Native attributes and handlers. The menu is labelled by its trigger by default. |

MenuContent does not expose a portal container, onOpenAutoFocus, or onEntryFocus.
Radix owns entry focus, positioning, dismissal and keyboard navigation. The
data-state, data-side and data-align attributes expose resolved content state.

### MenuItem

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| children | ReactNode | - | Item label, or one child when asChild is true. |
| asChild | boolean | false | Merge item behavior and styles onto one ref-forwarding child, such as a link. |
| className | string | - | Merged with svx-menu-item. |
| ref | \`Ref<HTMLDivElement>\` | - | Forwarded to the item; asChild renders the child element. |
| disabled | boolean | false | Prevent selection and skip the item during keyboard navigation. |
| textValue | string | rendered text | Explicit typeahead text, useful for non-text labels. |
| onSelect | (event: Event) => void | - | Pointer or keyboard activation. Calling preventDefault keeps the menu open. |
| div attributes / events | \`ComponentPropsWithoutRef<'div'>\` | - | Native attributes and handlers. Prefer onSelect over onClick for actions. |

Ref types remain tied to each part's default element even when asChild renders
another element; a callback accepting HTMLElement can observe the actual node.

Radix sets data-highlighted for pointer and keyboard focus and data-disabled
for disabled items. Existing Menu styles reuse surface-raised, border-default,
text-primary, text-disabled and interactive-surface-hover semantic tokens;
this coverage does not add or change tokens.

Known dark-theme limitation: text-disabled and surface-raised currently resolve
to the same color, so the disabled Delete label is not visually distinguishable.
This existing semantic-palette issue is not changed by these coverage stories.

### Keyboard and test coverage

Enter, Space or ArrowDown opens from the trigger; arrows navigate enabled items,
Home/End jump, and typing finds an item. Enter/Space selects; Escape dismisses
and restores trigger focus. Radix prevents Tab while the menu is open; use
arrows to navigate and Escape to return to the trigger.
The keyboard story checks these paths in a real browser. Unit tests cover
forwarding and supported interactions; the full Radix open/select cycle has a
known jsdom limitation and is not treated as a wrapper defect.
`;

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    triggerLabel: 'Project actions',
    triggerDisabled: false,
    itemDisabled: true,
    keepOpenOnSelect: false,
    modal: true,
    dir: 'ltr',
    side: 'bottom',
    sideOffset: 4,
    align: 'start',
    alignOffset: 0,
    loop: false,
  },
  argTypes: {
    triggerLabel: { control: 'text', description: 'Story-only: text rendered inside MenuTrigger.', table: { category: 'Story composition', type: { summary: 'string' }, defaultValue: { summary: 'Project actions' } } },
    triggerDisabled: { control: 'boolean', description: 'Story-only: forwarded to MenuTrigger.disabled.', table: { category: 'Story composition', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    itemDisabled: { control: 'boolean', description: 'Story-only: forwarded to the Delete MenuItem.disabled.', table: { category: 'Story composition', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } } },
    keepOpenOnSelect: { control: 'boolean', description: 'Story-only: calls preventDefault in each MenuItem.onSelect.', table: { category: 'Story composition', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    modal: { control: 'boolean', description: 'Menu: modal focus and outside-interaction behavior.', table: { category: 'Menu', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } } },
    dir: { control: 'inline-radio', options: ['ltr', 'rtl'], description: 'Menu: reading direction.', table: { category: 'Menu', type: { summary: "'ltr' | 'rtl'" }, defaultValue: { summary: 'inherited / ltr' } } },
    side: { control: 'select', options: ['top', 'right', 'bottom', 'left'], description: 'MenuContent: preferred side; collisions may flip it.', table: { category: 'MenuContent', type: { summary: "'top' | 'right' | 'bottom' | 'left'" }, defaultValue: { summary: 'bottom' } } },
    sideOffset: { control: 'number', description: 'MenuContent: distance from trigger in pixels.', table: { category: 'MenuContent', type: { summary: 'number' }, defaultValue: { summary: '4' } } },
    align: { control: 'select', options: ['start', 'center', 'end'], description: 'MenuContent: preferred alignment.', table: { category: 'MenuContent', type: { summary: "'start' | 'center' | 'end'" }, defaultValue: { summary: 'center' } } },
    alignOffset: { control: 'number', description: 'MenuContent: alignment adjustment in pixels.', table: { category: 'MenuContent', type: { summary: 'number' }, defaultValue: { summary: '0' } } },
    loop: { control: 'boolean', description: 'MenuContent: wrap keyboard navigation.', table: { category: 'MenuContent', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } } },
    children: { control: false, table: { disable: true } },
    open: { control: false, table: { disable: true } },
    defaultOpen: { control: false, table: { disable: true } },
    onOpenChange: { control: false, table: { disable: true } },
  },
  parameters: { docs: { description: { component: api } } },
  render: args => <MenuExample {...args} />,
} satisfies Meta<MenuStoryArgs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
    await expect(body.getByRole('menu')).toBeVisible();
    await userEvent.click(body.getByRole('menuitem', { name: 'Duplicate' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Last action: Duplicate');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const KeyboardNavigation: Story = {
  args: { loop: true },
  parameters: { docs: { description: { story: 'Open with ArrowDown; skip disabled Delete, wrap, jump, type ahead, select, and dismiss with Escape. Tab stays in the menu.' } } },
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button');
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const first = body.getByRole('menuitem', { name: 'Duplicate' });
    const last = body.getByRole('menuitem', { name: 'Archive' });
    await waitFor(() => expect(first).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(first).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(last).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(first).toHaveFocus();
    await userEvent.keyboard('a');
    await waitFor(() => expect(last).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('Last action: Archive');
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.keyboard(' ');
    await expect(body.getByRole('menu')).toBeVisible();
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus());
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('status')).toHaveTextContent('Last action: Duplicate');
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(body.getByRole('menu')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(body.getByRole('menu')).toBeVisible();
    await userEvent.keyboard('{Tab}');
    await expect(body.getByRole('menu')).toBeVisible();
    await expect(body.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const DisabledTrigger: Story = {
  args: { triggerDisabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toBeDisabled();
  },
};

export const KeepOpenOnSelect: Story = {
  args: { keepOpenOnSelect: true },
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button'));
    await userEvent.click(body.getByRole('menuitem', { name: 'Duplicate' }));
    await expect(body.getByRole('menu')).toBeVisible();
    // Modal menus hide the rest of the page from the accessibility tree.
    await expect(canvasElement.querySelector('[role="status"]')).toHaveTextContent('Last action: Duplicate');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
  },
};

export const Controlled: Story = {
  render: args => <ControlledExample {...args} />,
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    await expect(canvas.getByText('Controlled state: closed')).toBeVisible();
    await userEvent.click(canvas.getByRole('button'));
    await expect(canvas.getByText('Controlled state: open')).toBeInTheDocument();
    await userEvent.click(body.getByRole('menuitem', { name: 'Archive' }));
    await expect(canvas.getByText('Controlled state: closed')).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('Last action: Archive');
  },
};
