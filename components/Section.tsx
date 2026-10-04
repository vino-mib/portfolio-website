import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  index?: string;
  title: string;
  className?: string;
  children: ReactNode;
};

export function Section({ id, index, title, className = "max-w-[960px] py-[88px]", children }: SectionProps) {
  return (
    <section id={id} className="border-t border-[color-mix(in_srgb,var(--fg)_16%,transparent)]">
      <div className={`mx-auto px-6 ${className}`}>
        <h2 className="mb-8 text-[clamp(28px,3.4vw,38px)] leading-tight font-semibold">
          {index && <span className="mr-2.5 font-mono text-sm text-accent">{index}</span>}
          {title}
          <span className="mt-3 block h-0.5 w-10 rounded-full bg-accent" />
        </h2>
        {children}
      </div>
    </section>
  );
}
