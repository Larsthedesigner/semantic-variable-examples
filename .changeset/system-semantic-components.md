---
'@svx/react': patch
---

Use system semantic tokens for button, icon-button, split-button, and menu colors and interaction states, and add an optional Material Symbols icon wrapper.

Button and IconButton icon props now accept Material Symbols ligature names
instead of React nodes. SplitButton uses IconButton for its dropdown trigger;
all button icons and loading indicators share size mappings. Migrate
`icon={<MaterialSymbol name="add" />}` to `icon="add"` and pass names to
`iconStartIcon` / `iconEndIcon` as well.
