import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ReferenceHeader } from '../tokens/reference-header';

export function LayoutPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="sbx-reference sbx-layout-page">
    <ReferenceHeader eyebrow="Foundations / Layout" title={title} description={description} />
    <div className="sbx-layout-sections">{children}</div>
  </div>;
}

export function Specimen({ title, description, code, note, children }: {
  title: string; description?: string; code: string; note?: string; children: ReactNode;
}) {
  return <section className="sbx-layout-specimen">
    <header><h2>{title}</h2>{description && <p>{description}</p>}</header>
    <div className="sbx-layout-preview">{children}</div>
    <pre className="sbx-layout-code"><code>{code}</code></pre>
    {note && <p className="sbx-layout-note">{note}</p>}
  </section>;
}

export function Block({ children }: { children: ReactNode }) {
  return <div className="sbx-layout-block">{children}</div>;
}

export function useLayoutMeasurement(configuration?: string | number) {
  const ref = useRef<HTMLDivElement>(null);
  const [measurement, setMeasurement] = useState({ width: '', columns: 0, flow: '', padding: '', max: '', gap: '' });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const grid = element.querySelector('.svx-grid');
      const inline = element.querySelector('.svx-inline');
      const container = element.querySelector('.svx-container');
      const stack = element.querySelector('.svx-stack');
      const target = container ?? element;
      const style = getComputedStyle(target);
      setMeasurement({
        width: `${Math.round(target.getBoundingClientRect().width * 10) / 10}px`,
        columns: grid ? getComputedStyle(grid).gridTemplateColumns.split(/\s+/).filter(track => parseFloat(track) > 0).length : 0,
        flow: inline ? getComputedStyle(inline).gridAutoFlow : '',
        padding: style.paddingInlineStart,
        max: style.maxInlineSize,
        gap: grid ? getComputedStyle(grid).rowGap : stack ? getComputedStyle(stack).rowGap : '',
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll('.svx-grid, .svx-container, .svx-stack, .svx-inline').forEach(child => observer.observe(child));
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [configuration]);
  return { ref, measurement };
}
