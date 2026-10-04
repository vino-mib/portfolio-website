"use client";

import { useEffect, useState } from "react";

const sections = ["hero", "about", "projects", "skills", "experience", "contact"] as const;

type IconName = "home" | "about" | "projects" | "skills" | "experience" | "contact" | "sun" | "moon";

function Icon({ name }: { name: IconName }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-[22px] fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]",
    "aria-hidden": true as const,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        </svg>
      );
    case "about":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.2 19.2c1.1-2.8 3.2-4.2 6.8-4.2s5.7 1.4 6.8 4.2" />
        </svg>
      );
    case "projects":
      return (
        <svg {...common}>
          <path d="M3 7h6l2 2h10v10H3z" />
        </svg>
      );
    case "skills":
      return (
        <svg {...common}>
          <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
        </svg>
      );
    case "experience":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5h6v2M3 13h18" />
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "moon":
      return (
        <svg {...common}>
          <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
        </svg>
      );
  }
}

function Tip({ label }: { label: string }) {
  const box =
    "pointer-events-none absolute z-20 whitespace-nowrap rounded-lg border border-line bg-card px-2.5 py-[5px] text-[13px] text-fg opacity-0 transition";

  return (
    <>
      <span
        className={`${box} bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 sm:hidden`}
      >
        {label}
      </span>
      <span
        className={`${box} top-1/2 left-[calc(100%+12px)] hidden -translate-x-1 -translate-y-1/2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block`}
      >
        {label}
      </span>
    </>
  );
}

const itemClass = (active: boolean) =>
  `group relative grid size-11 place-items-center rounded-xl transition-colors outline-none hover:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] hover:text-accent focus-visible:bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] focus-visible:text-accent ${
    active
      ? "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-accent"
      : "text-muted"
  }`;

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const read = () => {
      setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const next = theme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      aria-label={
        theme === "light" ? "Switch to dark mode" : theme === "dark" ? "Switch to light mode" : "Toggle color theme"
      }
      onClick={() => {
        document.documentElement.dataset.theme = next;
        localStorage.setItem("theme", next);
        setTheme(next);
      }}
      className={`${itemClass(false)} cursor-pointer sm:mt-2`}
    >
      <span className="show-in-dark">
        <Icon name="sun" />
      </span>
      <span className="show-in-light">
        <Icon name="moon" />
      </span>
      <Tip label={theme === "light" ? "Dark mode" : "Light mode"} />
    </button>
  );
}

export function Nav() {
  const [active, setActive] = useState<string>("hero");

  useEffect(() => {
    const update = () => {
      const marker = window.innerHeight * 0.4;
      let current: string = sections[0];
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= marker) current = id;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1];
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const links: { href: string; label: string; icon: IconName }[] = [
    { href: "#hero", label: "Home", icon: "home" },
    { href: "#about", label: "About me", icon: "about" },
    { href: "#projects", label: "Projects", icon: "projects" },
    { href: "#skills", label: "Skills", icon: "skills" },
    { href: "#experience", label: "Experience", icon: "experience" },
    { href: "#contact", label: "Contact", icon: "contact" },
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-10 flex h-[60px] items-center justify-evenly border-t border-line bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-[10px] sm:inset-y-0 sm:right-auto sm:h-auto sm:w-[68px] sm:flex-col sm:justify-center sm:gap-2.5 sm:border-t-0 sm:border-r sm:pb-0 sm:pl-[env(safe-area-inset-left,0px)]"
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          data-tip={link.label}
          className={itemClass(active === link.href.slice(1))}
          onClick={() => setActive(link.href.slice(1))}
        >
          <Icon name={link.icon} />
          <Tip label={link.label} />
        </a>
      ))}
      <ThemeToggle />
    </nav>
  );
}
