"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Section } from "@/components/Section";
import { experience } from "@/lib/data";

const startYear = 2005;
const stepMs = 1900;
const driveMs = 1100;

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M7 4l13 8-13 8z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  );
}

function firstYear(period: string) {
  const match = period.match(/\d{4}/);
  return match ? Number(match[0]) : startYear;
}

export function Experience() {
  const endYear = new Date().getFullYear();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  const stops = experience.map((item, index) => ({ index, year: firstYear(item.period) }));
  const lastStop = stops[stops.length - 1];
  if (lastStop && endYear > lastStop.year) stops.push({ index: lastStop.index, year: endYear });

  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const placed = useRef(false);
  const replay = useRef(false);
  const [step, setStep] = useState(-1);
  const [trackWidth, setTrackWidth] = useState(0);
  const [moving, setMoving] = useState(false);
  const [glide, setGlide] = useState(true);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setTrackWidth(track.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
        setStep((current) => (current < 0 ? 0 : current));
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || step < 0 || step >= stops.length - 1) return;
    const timer = window.setTimeout(() => setStep((current) => current + 1), stepMs);
    return () => window.clearTimeout(timer);
  }, [step, stops.length, playing]);

  const active = step >= 0 ? stops[Math.min(step, stops.length - 1)] : null;
  const activeYear = active?.year ?? startYear;

  const compact = trackWidth > 0 && trackWidth < 640;
  const cardWidth = compact ? 168 : 240;
  const labeled = new Set([...stops.map((stop) => stop.year), endYear]);
  const roadTop = compact ? 140 : 118;

  const xFor = (year: number) => {
    const pad = compact ? 12 : 128;
    const span = Math.max(trackWidth - pad * 2, 1);
    return pad + ((year - startYear) / (endYear - startYear)) * span;
  };

  const markerLeft = compact
    ? Math.min(Math.max(xFor(activeYear) - cardWidth / 2, 0), Math.max(trackWidth - cardWidth, 0))
    : xFor(activeYear);

  useEffect(() => {
    if (glide) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setGlide(true));
    });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [glide]);

  const restart = () => {
    replay.current = true;
    setMoving(false);
    setGlide(false);
    setPlaying(true);
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
    setStep(0);
  };

  const finished = step >= stops.length - 1;
  const showPause = playing && !finished;

  const togglePlayback = () => {
    if (finished) {
      restart();
      return;
    }
    setPlaying((current) => !current);
  };

  useLayoutEffect(() => {
    if (!placed.current) {
      placed.current = true;
      return;
    }
    if (replay.current) {
      replay.current = false;
      return;
    }
    setMoving(true);
    const timer = window.setTimeout(() => setMoving(false), driveMs);
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (scroller && track) {
      const year = track.querySelector<HTMLElement>(`[data-year="${activeYear}"]`);
      if (year) {
        const target = year.offsetLeft - scroller.clientWidth / 2;
        scroller.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
      }
    }
    return () => window.clearTimeout(timer);
  }, [activeYear]);

  const chapter = active ? experience[active.index] : null;
  const progress = ((activeYear - startYear) / (endYear - startYear)) * 100;

  return (
    <Section id="experience" title="Experience" className="flex min-h-dvh max-w-6xl flex-col py-16 sm:px-10">
      <div className="flex flex-1 flex-col justify-center gap-12 pb-12">
      <div className="relative min-h-8">
        <p key={chapter ? `${active?.year}-${chapter.period}` : "start"} className="story-line min-h-6 pr-12 text-sm text-fg/90" aria-live="polite">
          {chapter?.story ?? `A path from ${startYear} to ${endYear}.`}
        </p>
        <button
          type="button"
          aria-label={showPause ? "Pause timeline" : "Play timeline"}
          onClick={togglePlayback}
          className="group absolute top-0 right-0 grid size-8 cursor-pointer place-items-center rounded-full border border-line bg-transparent p-0 text-fg hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {showPause ? <PauseIcon /> : <PlayIcon />}
          <span className="pointer-events-none absolute top-1/2 right-[calc(100%+10px)] -translate-y-1/2 translate-x-1 rounded-lg border border-line bg-card px-2.5 py-[5px] text-[13px] whitespace-nowrap text-fg opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
            {showPause ? "Pause" : "Play"}
          </span>
        </button>
      </div>
      <div ref={scrollerRef} className="overflow-x-hidden pb-2 sm:overflow-x-auto">
        <div ref={trackRef} className="relative sm:min-w-[1040px]" style={{ height: roadTop + 50 }}>
          <div
            className="absolute h-px bg-line"
            style={{ top: roadTop, left: xFor(startYear), width: Math.max(xFor(endYear) - xFor(startYear), 0) }}
            aria-hidden="true"
          >
            <div className="h-full origin-left bg-accent transition-[width] duration-1000 ease-out" style={{ width: `${progress}%` }} />
          </div>
          {years.map((year) => {
              const reached = year <= activeYear;
            return (
              <span
                key={year}
                data-year={year}
                className="absolute flex -translate-x-1/2 flex-col items-center"
                style={{ top: roadTop - 4, left: xFor(year) }}
              >
                <span className={`w-px ${compact && !labeled.has(year) ? "h-1.5" : "h-2.5"} ${year === activeYear ? "bg-accent" : "bg-line"}`} />
                {(!compact || labeled.has(year)) && (
                  <span
                    className={`mt-1 font-mono tabular-nums ${compact ? "text-[9px]" : "text-[10px]"} ${
                      year === activeYear ? "font-semibold text-accent" : reached ? "text-muted" : "text-muted/40"
                    }`}
                  >
                    {compact ? `'${String(year).slice(2)}` : year}
                  </span>
                )}
              </span>
            );
          })}
          {active && (
            <article
              className="panel absolute top-0 rounded-lg px-3.5 py-2.5"
              style={{
                width: cardWidth,
                left: markerLeft,
                transform: compact
                  ? moving
                    ? "skewX(-7deg)"
                    : undefined
                  : moving
                    ? "translateX(-50%) skewX(-7deg)"
                    : "translateX(-50%)",
                transition: glide ? "left 1100ms cubic-bezier(0.16, 0.84, 0.22, 1), transform 280ms ease" : undefined,
              }}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-1/2 right-full h-px w-14 -translate-y-1/2 bg-gradient-to-l from-accent to-transparent transition-opacity ${
                  moving ? "opacity-100" : "opacity-0"
                }`}
              />
              <p className="text-[11px] font-medium tracking-wide text-accent">{chapter?.period}</p>
              <h3 className="mt-0.5 text-sm leading-tight font-semibold">{chapter?.title}</h3>
              <p className="text-[13px] text-muted">{chapter?.company}</p>
            </article>
          )}
        </div>
      </div>
      </div>
    </Section>
  );
}
