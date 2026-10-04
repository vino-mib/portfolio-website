"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
import { experience } from "@/lib/data";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Section
      id="experience"
      title="Experience"
      className="flex min-h-dvh max-w-6xl flex-col py-12 sm:px-10"
    >
      <div ref={ref} className="relative flex w-full flex-1 flex-col">
        <div className="absolute top-2 bottom-2 left-3 w-0.5 sm:left-1/2 sm:-translate-x-1/2">
          <div className={`h-full w-full origin-top bg-line ${visible ? "timeline-line" : "scale-y-0"}`} />
          {visible && <span className="timeline-bead" />}
        </div>
        <ol className="flex flex-1 flex-col justify-between gap-4">
          {experience.map((item, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            return (
              <li
                key={item.company}
                className={`relative pl-10 sm:grid sm:grid-cols-2 sm:gap-16 sm:pl-0 ${
                  visible ? `timeline-item timeline-item-${side}` : "opacity-0"
                }`}
                style={{ animationDelay: `${180 + index * 140}ms` }}
              >
                <span className="absolute top-5 left-1.5 grid size-3.5 place-items-center sm:left-1/2 sm:-translate-x-1/2">
                  <span
                    className={`size-3.5 rounded-full border-2 border-bg bg-accent ${visible ? "timeline-dot" : "scale-0"}`}
                    style={{ animationDelay: `${index * 140}ms` }}
                  />
                </span>
                <article
                  className={`panel rounded-[14px] p-4 sm:px-6 sm:py-5 ${
                    side === "left" ? "sm:col-start-1 sm:text-right" : "sm:col-start-2"
                  }`}
                >
                  <p className="font-mono text-[11px] tracking-[0.12em] text-accent uppercase">{item.period}</p>
                  <h3 className="mt-1.5 text-xl leading-tight font-bold">{item.title}</h3>
                  <p className="mt-0.5 text-[15px] text-muted">{item.company}</p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
