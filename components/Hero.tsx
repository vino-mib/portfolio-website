"use client";

import { useEffect, useRef, useState } from "react";
import { edges, nodes, stages, type DiagramNode } from "@/lib/diagram";

const nodeIndex = Object.fromEntries(nodes.map((node, index) => [node.id, index]));

type Colors = {
  fg: string;
  muted: string;
  accent: string;
  accent2: string;
  line: string;
  bg: string;
};

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

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useRef<{ go: (stage: number) => void; toggle: () => void }>({
    go: () => {},
    toggle: () => {},
  });
  const [stage, setStage] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = stageRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let pointerX = -1;
    let pointerY = -1;
    let current = 1;
    let previous = 0;
    let changedAt = performance.now();
    let isPlaying = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frameId = 0;
    const colors: Colors = { fg: "", muted: "", accent: "", accent2: "", line: "", bg: "" };

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      const value = (name: string) => style.getPropertyValue(name).trim();
      colors.fg = value("--fg");
      colors.muted = value("--muted");
      colors.accent = value("--accent");
      colors.accent2 = value("--accent2");
      colors.line = value("--line");
      colors.bg = value("--bg");
    };

    const visible = (from: number, to: number, value: number) => from <= value && value <= to;

    const alpha = (from: number, to: number, now: number) => {
      const progress = Math.min(1, (now - changedAt) / 500);
      const showing = visible(from, to, current);
      const wasShowing = visible(from, to, previous);
      if (showing && wasShowing) return 1;
      if (showing) return progress;
      if (wasShowing) return 1 - progress;
      return 0;
    };

    const labelFor = (node: DiagramNode) => {
      let label = node.label;
      if (node.aliases) {
        for (const key of Object.keys(node.aliases)) {
          if (Number(key) <= current) label = node.aliases[Number(key)];
        }
      }
      return label;
    };

    const position = (node: DiagramNode, time: number): [number, number] => [
      node.x * width + Math.sin(time / 1800 + node.x * 9) * 4,
      46 + (0.08 + node.y * 0.56) * height + Math.cos(time / 2100 + node.y * 9) * 4,
    ];

    const frame = () => {
      const now = performance.now();
      const time = now;
      ctx.clearRect(0, 0, width, height);
      const points = nodes.map((node) => position(node, time));

      let hot = -1;
      points.forEach((point, index) => {
        const node = nodes[index];
        if (
          pointerX >= 0 &&
          alpha(node.from, node.to, now) > 0.5 &&
          Math.hypot(point[0] - pointerX, point[1] - pointerY) < 44
        ) {
          hot = index;
        }
      });

      edges.forEach((edge, index) => {
        const from = nodeIndex[edge.from];
        const to = nodeIndex[edge.to];
        const visibility = alpha(edge.start, edge.end, now);
        if (visibility <= 0) return;

        const highlighted = hot === from || hot === to;
        ctx.globalAlpha = visibility * (highlighted ? 1 : 0.85);
        ctx.strokeStyle = highlighted ? colors.accent : colors.line;
        ctx.lineWidth = highlighted ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(points[from][0], points[from][1]);
        ctx.lineTo(points[to][0], points[to][1]);
        ctx.stroke();

        for (let particle = 0; particle < 2; particle += 1) {
          const offset = ((time / 2600) + index * 0.37 + particle * 0.5) % 1;
          const travel = particle ? 1 - offset : offset;
          const x = points[from][0] + (points[to][0] - points[from][0]) * travel;
          const y = points[from][1] + (points[to][1] - points[from][1]) * travel;
          ctx.fillStyle = particle ? colors.accent2 : colors.accent;
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(x, y, 2.3, 0, 7);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      const fontSize = width < 640 ? 9 : 12;
      ctx.font = `500 ${fontSize}px "JetBrains Mono Variable", ui-monospace, Menlo, Consolas, monospace`;
      ctx.textAlign = "center";

      nodes.forEach((node, index) => {
        const visibility = alpha(node.from, node.to, now);
        if (visibility <= 0) return;
        const [x, y] = points[index];
        const text = labelFor(node);
        const boxWidth = ctx.measureText(text).width + 16;
        const boxHeight = fontSize + 12;
        const highlighted = index === hot;
        const scale = 0.85 + 0.15 * visibility;

        ctx.globalAlpha = visibility;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = colors.bg;
        ctx.strokeStyle = highlighted || (node.from === current && current > 1) ? colors.accent : colors.line;
        ctx.lineWidth = highlighted ? 1.8 : 1.2;
        ctx.beginPath();
        ctx.roundRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = highlighted ? colors.accent : colors.fg;
        ctx.fillText(text, 0, fontSize / 3);
        ctx.restore();
      });

      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(frame);
    };

    const resize = () => {
      const bounds = hero.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = width * density;
      canvas.height = height * density;
      ctx.setTransform(density, 0, 0, density, 0, 0);
      readColors();
    };

    const themeObserver = new MutationObserver(resize);

    const sync = () => {
      setStage(current);
      setPlaying(isPlaying);
    };

    const go = (next: number) => {
      if (next === current) return;
      previous = current;
      current = next;
      changedAt = performance.now();
      sync();
    };

    const schedule = () => {
      clearTimeout(timer);
      if (!isPlaying) return;
      timer = setTimeout(
        () => {
          go((current % stages.length) + 1);
          schedule();
        },
        current === stages.length ? 10000 : 8300,
      );
    };

    controls.current.go = (next) => {
      go(next);
      schedule();
    };
    controls.current.toggle = () => {
      isPlaying = !isPlaying;
      sync();
      schedule();
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };
    const onPointerLeave = () => {
      pointerX = -1;
      pointerY = -1;
    };

    const resizeObserver = new ResizeObserver(resize);
    window.addEventListener("resize", resize);
    resizeObserver.observe(hero);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    hero.addEventListener("pointermove", onPointerMove);
    hero.addEventListener("pointerleave", onPointerLeave);

    resize();
    sync();
    frameId = requestAnimationFrame(frame);
    schedule();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  const currentStage = stages[stage - 1];

  return (
    <header id="hero" className="relative h-dvh max-h-dvh overflow-hidden">
      <div ref={stageRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Animated diagram showing a system scaling from a single server to millions of users in nine stages"
          className="absolute inset-0 block h-full w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
        {!introVisible && (
        <div className="hero-stage pointer-events-none absolute inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom,0px))] z-[1] px-4 sm:bottom-5">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-2 text-center">
          <p className="font-mono text-[10px] leading-none tracking-[0.14em] text-accent/80 uppercase sm:text-[11px]">
            Stage {stage} / {stages.length} · {currentStage.scale}
          </p>
          <p className="text-sm leading-snug text-muted/80">
            <span className="font-medium text-fg/90">{currentStage.title}</span>
            {" — "}
            {currentStage.description}
          </p>
          <div className="pointer-events-auto flex h-8 items-center gap-4">
            <div className="flex items-center gap-2.5" role="group" aria-label="Scaling stages">
              {stages.map((item, index) => {
                const number = index + 1;
                const selected = number === stage;
                return (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Stage ${number}: ${item.title}`}
                    aria-current={selected ? "true" : undefined}
                    title={item.title}
                    onClick={() => controls.current.go(number)}
                    className={`h-2 cursor-pointer rounded-full border p-0 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      selected ? "w-5 border-accent bg-accent" : "w-2 border-muted/50 bg-muted/30 hover:bg-muted/60"
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              aria-label={playing ? "Pause animation" : "Play animation"}
              onClick={() => controls.current.toggle()}
              className="grid size-8 cursor-pointer place-items-center rounded-full bg-transparent p-0 text-fg hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
          </div>
        </div>
        )}
      </div>
      {introVisible && (
        <div className="hero-intro pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 pb-36 sm:px-8 sm:pb-28 sm:pl-[92px]">
          <div className="hero-copy mx-auto w-full min-w-0 max-w-4xl text-center">
            <p className="hero-badge mx-auto mt-8 mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium whitespace-nowrap sm:text-[13px]">
              <span className="hero-badge-dot size-1.5 rounded-full" />
              Lead Software Engineer
            </p>
            <h1 className="hero-name leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
              Vinothkumar Chandrasekaran
            </h1>
            <p className="hero-caption mx-auto mt-5 max-w-2xl leading-relaxed text-pretty">
              <span className="hero-caption-lead">16 years of expertise</span>
              {" architecting high-performance web applications, event-driven cloud systems, and scalable GenAI platforms."}
            </p>
            <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#projects" className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold">
                View my work
              </a>
              <a href="#contact" className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-semibold text-fg">
                Get in touch
              </a>
              <button
                type="button"
                onClick={() => setIntroVisible(false)}
                className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-semibold text-fg"
              >
                Watch animation
              </button>
            </div>
          </div>
        </div>
      )}
      {!introVisible && (
        <button
          type="button"
          onClick={() => setIntroVisible(true)}
          className="btn-ghost absolute top-4 right-4 z-20 rounded-lg px-4 py-2 text-sm font-semibold text-fg sm:top-6 sm:right-6"
        >
          Show intro
        </button>
      )}
    </header>
  );
}
