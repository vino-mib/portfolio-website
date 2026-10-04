"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
import { skills } from "@/lib/data";

const groups = Object.entries(skills);

export function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Section
      id="skills"
      title="Skills"
      className="flex min-h-dvh max-w-6xl flex-col justify-center py-16 sm:px-10"
    >
      <div
        ref={ref}
        className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        {groups.map(([group, labels], index) => (
          <article
            key={group}
            className={`panel rounded-xl p-5 sm:p-6 ${
              index < 2 ? "lg:col-span-3" : "lg:col-span-2"
            } ${visible ? "skill-card" : "translate-y-4 opacity-0"}`}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <h3 className="text-base font-semibold">{group}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {labels.map((label) => (
                <span key={label} className="rounded-md border border-line bg-bg/50 px-2.5 py-1 text-sm text-fg/85">
                  {label}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
