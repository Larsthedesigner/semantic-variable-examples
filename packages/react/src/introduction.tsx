import { ReferenceHeader } from './tokens/reference-header';

export function Introduction({ dark = false }: { dark?: boolean }) {
  return (
    <main className={`sbx-reference sbx-introduction${dark ? ' dark' : ''}`}>
      <ReferenceHeader
        eyebrow="Example Design System"
        title="An exploratory design system"
        description="Explore primitives, semantics, components, and their usage in an example design system."
      />

      <div className="sbx-introduction-sections">
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading">About Storybook</h2>
          <p>Storybook is a sandbox environment for exploring and developing UI components. Browse foundations such as color, typography, spacing, motion, and layout, or explore component stories for states and compositions.</p>
        </section>

        <section aria-labelledby="tokens-heading">
          <h2 id="tokens-heading">Semantic driven design decisions</h2>
          <p>When usage is implied, engineers and AI can deterministically infer proper usage.</p>
        </section>
      </div>
    </main>
  );
}
