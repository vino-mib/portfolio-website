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
    <section id={id} className={`mx-auto px-6 ${className}`}>
      <h2 className="mb-6 text-[28px] font-bold">
        {index && <span className="mr-2.5 font-mono text-sm text-accent">{index}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}
