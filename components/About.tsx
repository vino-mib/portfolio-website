import { Section } from "@/components/Section";
import portrait from "@/public/vinoth.png";

const facts = [
  { label: "Experience", value: "16 years" },
  { label: "Based in", value: "Chennai" },
  { label: "Now", value: "EPAM Anywhere" },
];

export function About() {
  return (
    <Section
      id="about"
      title="About me"
      className="flex min-h-dvh max-w-6xl flex-col justify-center py-16 sm:px-10"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
        <figure className="panel mx-auto w-full max-w-[280px] overflow-hidden rounded-[18px]">
          <img
            src={portrait.src}
            width={portrait.width}
            height={portrait.height}
            alt="Vinothkumar Chandrasekaran"
            className="aspect-square w-full object-cover object-[center_18%]"
          />
        </figure>

        <div>
          <p className="font-display text-[clamp(22px,2.6vw,32px)] leading-tight font-semibold tracking-[-0.02em]">
            I build web, cloud, and GenAI systems that stay fast as they grow.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
            For 16 years I have architected high-performance web applications, event-driven cloud systems, and
            scalable GenAI platforms. I am a Lead Software Engineer at EPAM Anywhere, based in Chennai.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
            Recent work includes TargetX at Bayer, a multi-tenant RAG chatbot, ML serving on Kubernetes, retail
            and business banking at Rabobank, and CheckIn for Apple campuses.
          </p>

          <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-line bg-bg/50 px-4 py-3">
                <dt className="font-mono text-[10px] tracking-[0.14em] text-accent uppercase">{fact.label}</dt>
                <dd className="mt-1 text-sm font-semibold">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
