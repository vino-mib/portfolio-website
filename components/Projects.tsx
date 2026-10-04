"use client";

import { useEffect, useState } from "react";
import { Section } from "@/components/Section";
import { projects, type Project } from "@/lib/data";

const facts = [
  { key: "problem", label: "Problem" },
  { key: "approach", label: "Approach" },
  { key: "impact", label: "Impact" },
] as const;

function Flow({ flow, stacked = false }: { flow: string[]; stacked?: boolean }) {
  if (stacked) {
    return (
      <div className="flex flex-col">
        {flow.map((step, index) => (
          <div key={step}>
            <div className="w-fit rounded-full border border-accent/50 bg-[color-mix(in_srgb,var(--accent)_12%,var(--card))] px-3 py-1.5 text-xs font-semibold">
              {step}
            </div>
            {index < flow.length - 1 && <div className="ml-4 h-4 w-px bg-line" />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-w-[520px] items-center">
      {flow.map((step, index) => (
        <div key={step} className="flex min-w-0 flex-1 items-center">
          <div className="rounded-full border border-accent/50 bg-[color-mix(in_srgb,var(--accent)_12%,var(--card))] px-3 py-1.5 text-xs font-semibold whitespace-nowrap">
            {step}
          </div>
          {index < flow.length - 1 && (
            <div className="relative mx-2 h-px min-w-6 flex-1 bg-line">
              <span className="project-packet absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CaseStudy({
  project,
  stacked = false,
  titleId,
}: {
  project: Project;
  stacked?: boolean;
  titleId?: string;
}) {
  return (
    <>
      <p className="font-mono text-[11px] tracking-[0.16em] text-accent uppercase">Case study</p>
      <h3 id={titleId} className="mt-2 text-2xl leading-tight font-bold">
        {project.title}
      </h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{project.description}</p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {facts.map((fact) => (
          <div key={fact.key} className="rounded-xl border border-line bg-bg/50 p-3">
            <dt className="font-mono text-[10px] tracking-[0.14em] text-accent uppercase">{fact.label}</dt>
            <dd className="mt-1.5 text-sm leading-snug">{project[fact.key]}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-sm text-muted">
        <span className="font-semibold text-fg">Role. </span>
        {project.role}
      </p>

      <div className="mt-5 overflow-x-auto">
        <Flow flow={project.flow} stacked={stacked} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-line px-[9px] py-[3px] text-xs text-muted">
            {tag}
          </span>
        ))}
      </div>
    </>
  );
}

export function Projects() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const project = projects[active];

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <Section
      id="projects"
      title="Projects"
      className="flex min-h-dvh max-w-6xl flex-col justify-center py-12 sm:px-10"
    >
      <div className="grid gap-3 lg:hidden">
        {projects.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => {
              setActive(index);
              setOpen(true);
            }}
            className="panel rounded-[14px] p-4 text-left"
          >
            <span className="font-mono text-[10px] tracking-[0.14em] text-accent">0{index + 1}</span>
            <span className="mt-1 block text-base font-bold">{item.title}</span>
            <span className="mt-1 block text-sm leading-snug text-muted">{item.description}</span>
            <span className="mt-3 inline-block text-sm font-semibold text-accent2">View case study</span>
          </button>
        ))}
      </div>

      <div className="hidden items-start gap-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="flex flex-col gap-2" role="tablist" aria-label="Projects">
          {projects.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(index)}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  selected
                    ? "border-accent bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-fg"
                    : "border-line bg-card text-muted hover:text-fg"
                }`}
              >
                <span className="font-mono text-[10px] tracking-[0.14em] text-accent">0{index + 1}</span>
                <span className="mt-0.5 block font-semibold">{item.title}</span>
              </button>
            );
          })}
        </div>

        <article key={project.title} className="panel project-stage min-w-0 rounded-[14px] p-5 sm:p-8">
          <CaseStudy project={project} />
        </article>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close project"
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            className="panel absolute inset-x-3 top-1/2 max-h-[min(86dvh,720px)] -translate-y-1/2 overflow-y-auto rounded-[18px] p-5"
          >
            <div className="mb-1 flex items-start justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full border border-line text-muted"
                aria-label="Close"
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>
            <CaseStudy project={project} stacked titleId="project-dialog-title" />
          </div>
        </div>
      )}
    </Section>
  );
}
