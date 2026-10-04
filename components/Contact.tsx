import type { ReactNode } from "react";
import { Section } from "@/components/Section";
import { contact } from "@/lib/data";

const mapQuery = encodeURIComponent(contact.address);

function Row({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex gap-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] tracking-[0.14em] text-accent uppercase">{label}</p>
        <div className="mt-0.5 text-[15px] leading-snug">{children}</div>
      </div>
    </div>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  className: "size-5 fill-none stroke-current stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]",
  "aria-hidden": true as const,
};

export function Contact() {
  return (
    <Section
      id="contact"
      title="Contact"
      className="flex min-h-dvh max-w-6xl flex-col justify-center py-16 sm:px-10"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="panel flex flex-col rounded-[14px] p-6 sm:p-8">
          <p className="font-display text-[clamp(22px,2.4vw,28px)] leading-tight font-semibold tracking-[-0.02em]">
            Let’s build something that scales.
          </p>
          <p className="mt-2 text-sm text-muted">Reach out by email or phone, or connect on LinkedIn and GitHub.</p>

          <div className="mt-7 space-y-5">
            <Row
              label="Email"
              icon={
                <svg {...iconProps}>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              }
            >
              <a className="break-all hover:text-accent" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </Row>
            <Row
              label="Phone"
              icon={
                <svg {...iconProps}>
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
                </svg>
              }
            >
              <a className="hover:text-accent" href={`tel:${contact.phone}`}>
                {contact.phoneDisplay}
              </a>
            </Row>
            <Row
              label="Address"
              icon={
                <svg {...iconProps}>
                  <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              }
            >
              <a
                className="hover:text-accent"
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contact.address}
              </a>
            </Row>
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-8">
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              LinkedIn
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost rounded-lg px-5 py-2.5 text-sm font-semibold"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="panel min-h-[320px] overflow-hidden rounded-[14px] lg:min-h-[460px]">
          <iframe
            title={`Map of ${contact.address}`}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="block h-full min-h-[320px] w-full border-0 lg:min-h-[460px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}
