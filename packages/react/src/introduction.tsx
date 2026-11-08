import { ReferenceHeader } from './tokens/reference-header';

export function Introduction({ dark = false }: { dark?: boolean }) {
  return (
    <main className={`sbx-reference sbx-introduction${dark ? ' dark' : ''}`}>
      <ReferenceHeader
        eyebrow="Semantic Variable Examples"
        title="Welcome to the design system"
        description="Explore the foundations, components, and decisions behind a shared design language for people and the tools that help them build together."
      />

      <div className="sbx-introduction-sections">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading">Explore Storybook</h2>
          <p>Browse foundations such as color, typography, spacing, motion, and layout, or explore component stories for states and compositions. Component Docs pages describe the public API; token stories show component mappings.</p>
          <p>Use controls, theme comparison stories, and the Accessibility panel to inspect examples. The addon supports, but does not replace, keyboard and accessibility testing.</p>
          <ul className="sbx-introduction-links">
            <li><a href="./?path=/story/foundations-color--semantics" target="_top">Explore color semantics</a></li>
            <li><a href="./?path=/story/foundations-layout--overview" target="_top">Explore layout foundations</a></li>
            <li><a href="./?path=/story/components-button--solid" target="_top">Explore Button</a></li>
          </ul>
        </section>

        <section aria-labelledby="tokens-heading">
          <h2 id="tokens-heading">From primitives to purpose</h2>
          <p>Tokens are authored as CSS. Primitives provide the raw palette and scales; semantic tokens describe intent and change by theme. Component tokens provide mappings for a specific component where needed.</p>
          <ol className="sbx-introduction-flow">
            <li><strong>Primitive:</strong> <code>--size-px-12</code> is a raw size value.</li>
            <li><strong>Semantic:</strong> <code>--system-spacer-px-md</code> gives that size a spacing role.</li>
            <li><strong>Component:</strong> <code>--component-button-padding-x-md</code> maps Button padding to that role.</li>
          </ol>
          <p>Not every property follows all three steps: component geometry can use primitive scales directly. For application UI, prefer existing components and semantic roles over choosing raw palette values.</p>
          <p>Light, dark, and high-contrast modes override semantic mappings, not the underlying palette. The token build produces CSS and JSON as well as Compose and Swift outputs; CSS-only expressions may not have native equivalents.</p>
          <a href="./?path=/story/foundations-size--semantics" target="_top">Explore size semantics</a>
        </section>

        <section aria-labelledby="workflow-heading">
          <h2 id="workflow-heading">Built for engineers and AI-assisted work</h2>
          <p>Start with existing component stories, props, and token references. Reuse a role when its intent and state behavior match; add a new mapping only when it is needed.</p>
          <p>Run <code>pnpm storybook</code> and connect the workspace's <code>svx-storybook</code> MCP server in VS Code. Its tools help agents discover components and stories, understand props, and preview changes. The MCP server is available on the local dev server, not static builds, and does not run tests.</p>
          <p>Use the repository guidance and tests alongside Storybook. Check relevant themes, focus, keyboard interaction, reduced motion, and contrast in context.</p>
          <p>For setup and contribution details, see the repository README, <code>AGENTS.md</code>, and <code>docs/design-system-guidance.md</code>.</p>
        </section>
      </div>
    </main>
  );
}
