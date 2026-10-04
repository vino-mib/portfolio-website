export type Project = {
  title: string;
  description: string;
  problem: string;
  approach: string;
  impact: string;
  role: string;
  flow: string[];
  tags: string[];
};

export const projects: Project[] = [
  {
    title: "TargetX (Bayer)",
    description:
      "Drug discovery platform for identifying and validating targets from gene expression and disease pathways.",
    problem: "Researchers needed a faster way to connect gene expression data with disease pathways and candidate targets.",
    approach: "A discovery platform on Next.js, Node.js, and FastAPI, deployed on AWS.",
    impact: "Scientists can identify and validate targets from expression data and disease pathways in one workflow.",
    role: "Platform and API engineering",
    flow: ["Gene data", "Next.js", "FastAPI", "AWS"],
    tags: ["Next.js", "Node.js", "FastAPI", "AWS"],
  },
  {
    title: "Multi-tenant RAG Chatbot (Syncron)",
    description:
      "Secure, event-driven chatbot for natural-language Q&A over technical documentation.",
    problem: "Technical documentation was hard to query, and each tenant’s answers had to stay isolated.",
    approach: "An event-driven chatbot on Kafka and Kubernetes, using Titan and Claude for retrieval and answers.",
    impact: "Natural-language Q&A over technical documentation, with tenant boundaries kept in the pipeline.",
    role: "Event-driven architecture and chatbot platform",
    flow: ["Docs", "Kafka", "Kubernetes", "Claude"],
    tags: ["Angular", "Kafka", "Kubernetes", "Titan", "Claude"],
  },
  {
    title: "ML Configurator",
    description:
      "UI for data scientists; moved to KServe/Knative/Istio, cutting infrastructure cost 65% versus SageMaker endpoints.",
    problem: "SageMaker endpoints made model serving more expensive than the team needed.",
    approach: "A data-scientist UI on Angular, with inference moved to KServe, Knative, and Istio.",
    impact: "Infrastructure cost cut 65% versus SageMaker endpoints.",
    role: "Serving platform and scientist UI",
    flow: ["Angular", "Istio", "Knative", "KServe"],
    tags: ["Angular", "KServe", "Istio", "Knative"],
  },
  {
    title: "Rabobank Features",
    description:
      "Bunq and Moneybox integrations, business accounts, report download using micro UIs.",
    problem: "New banking features had to ship without tying every change to one large frontend.",
    approach: "Micro UIs for Bunq, Moneybox, business accounts, and report download, covered with Jest.",
    impact: "Integrations and reports could be released as independent interface slices.",
    role: "Micro-frontend delivery",
    flow: ["Shell", "Micro UI", "Accounts", "Reports"],
    tags: ["Angular", "Micro Frontends", "Jest"],
  },
  {
    title: "CheckIn (Apple campuses)",
    description:
      "iPad app with a React console, Express APIs, scaled and cached MySQL.",
    problem: "Campus check-in needed a fast path from the iPad to stored records as usage grew.",
    approach: "An iPad app, a React console, and Express APIs in front of scaled, cached MySQL.",
    impact: "Hot reads stayed on Memcached while MySQL remained the system of record.",
    role: "App, API, and data-tier scaling",
    flow: ["iPad", "Express", "Memcached", "MySQL"],
    tags: ["React", "Express", "MySQL", "Memcached"],
  },
];

export const skills: Record<string, string[]> = {
  Frontend: ["React", "Angular", "TypeScript", "RxJS", "Micro Frontend"],
  Backend: ["Node.js", "FastAPI", "Kafka", "Microservices", "OpenAPI"],
  Databases: ["MySQL", "PostgreSQL", "MongoDB", "Memcached"],
  AI: ["Generative AI", "Bedrock Agents", "Knowledge Bases", "OpenSearch"],
  "Cloud & DevOps": ["AWS", "GCP", "Docker", "Kubernetes", "Istio", "GitHub Actions"],
};

export type ExperienceItem = {
  company: string;
  title: string;
  period: string;
};

export const experience: ExperienceItem[] = [
  { company: "EPAM Anywhere", title: "Lead Software Engineer", period: "Jan 2022 - present" },
  { company: "Cognizant", title: "Senior Associate", period: "Feb 2018 - Sep 2021" },
  { company: "Wipro", title: "Tech Lead", period: "Mar 2013 - Jan 2018" },
  { company: "Logica", title: "IT Consultant", period: "Nov 2010 - Apr 2013" },
  { company: "Metamorphosis", title: "PHP Programmer", period: "Nov 2007 - Oct 2008" },
];

export const contact = {
  email: "vino.mib@gmail.com",
  phone: "+918056000041",
  phoneDisplay: "+91 80560 00041",
  address: "Ramaniyam Pushkar, Kalaignar Karunanidhi Salai, Sholinganallur, Chennai",
  linkedin: "https://www.linkedin.com/in/gritbee",
  github: "https://github.com/vino-mib",
};
