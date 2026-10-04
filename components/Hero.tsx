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
    <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden="true">
      <path d="M7 4l13 8-13 8z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  );
}

export function Hero() {
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useRef<{ go: (stage: number) => void; toggle: () => void }>({
    go: () => {},
    toggle: () => {},
  });
  const [stage, setStage] = useState(1);
  const [playing, setPlaying] = useState(true);

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
      (0.2 + node.y * 0.56) * height + Math.cos(time / 2100 + node.y * 9) * 4,
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
      ctx.font = `${fontSize}px ui-monospace, Menlo, Consolas, monospace`;
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
        current === stages.length ? 5000 : 3300,
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

    window.addEventListener("resize", resize);
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
      themeObserver.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  const currentStage = stages[stage - 1];

  return (
    <header ref={stageRef} id="hero" className="relative h-dvh max-h-dvh overflow-hidden">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Animated diagram showing a system scaling from a single server to millions of users in nine stages"
        className="absolute inset-0 block h-full w-full"
      />
      <div className="hero-intro pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-bg via-bg/85 to-transparent">
        <div className="mx-auto w-full max-w-4xl px-6 pt-7 pb-8 text-center sm:px-8 sm:pt-9">
          <h1 className="gradient-name text-[clamp(26px,3.2vw,42px)] leading-none font-bold tracking-[-0.03em] text-balance">
            Vinothkumar Chandrasekaran
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-[clamp(13px,1.4vw,17px)] leading-snug text-pretty text-muted">
            <span className="font-semibold text-accent">16 years of experience</span>
            {" — scaling systems, from LAMP monoliths to event-driven AI chatbots and apps"}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      <div className="absolute inset-x-0 bottom-[calc(68px+env(safe-area-inset-bottom,0px))] px-4 sm:bottom-5">
        <div className="mx-auto w-full max-w-xl text-center">
          <p className="font-mono text-[10px] leading-tight tracking-[0.14em] text-accent uppercase sm:text-[11px]">
            Stage {stage} / {stages.length} · {currentStage.scale}
          </p>
          <p className="mt-1 text-[15px] leading-tight font-semibold">{currentStage.title}</p>
          <p className="mt-1 text-xs leading-snug text-muted">{currentStage.description}</p>
          <div className="relative mt-2.5 flex items-center justify-center">
            <div className="flex items-center gap-1.5" role="group" aria-label="Scaling stages">
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
                    className={`size-2 cursor-pointer rounded-full border p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      selected ? "scale-125 border-accent bg-accent" : "border-line bg-card"
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              aria-label={playing ? "Pause animation" : "Play animation"}
              onClick={() => controls.current.toggle()}
              className="absolute right-0 grid size-7 cursor-pointer place-items-center rounded-full border border-line bg-card p-0 text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
