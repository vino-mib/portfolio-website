export type Project = {
  title: string;
  description: string;
  problem: string;
  approach: string;
  impact: string;
  role: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    title: "TargetX (Bayer)",
    description:
      "Scientists evaluate possible drug targets in one application, across gene–disease evidence, pathways, omics, literature, nomination, and a Genie assistant.",
    problem:
      "Gene, disease, literature, pathway, expression, and omics evidence lived in separate tools, so judging a target meant piecing the case together by hand.",
    approach:
      "A React workspace with Gene-Disease Link, Gene Hub, Literature Explorer, Target Nomination, and Genie. FastAPI reads Neo4j and S3 immediately, and sends mechanism mining to SQS and omics prediction to SageMaker.",
    impact:
      "A selected gene opens knowledge-graph scores, expression, Geneformer perturbation results, and literature-backed mechanisms. Literature and Genie use GPT-4o; omics ranking uses RotatE embeddings.",
    role: "Full stack engineer",
    tags: ["React", "FastAPI", "Neo4j", "GPT-4o", "SageMaker"],
  },
  {
    title: "Multi-tenant RAG Chatbot (Syncron)",
    description:
      "Secure, event-driven chatbot for natural-language Q&A over technical documentation.",
    problem: "Technical documentation was hard to query, and each tenant’s answers had to stay isolated.",
    approach:
      "An event-driven chatbot on Kafka and Kubernetes, using Titan Embeddings to vectorize technical content for storage in a vector database, and Claude as the foundation model for reasoning and response generation.",
    impact: "Natural-language Q&A over technical documentation, with tenant boundaries kept in the pipeline.",
    role: "Event-driven architecture and chatbot platform",
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
    tags: ["Angular", "KServe", "Istio", "Knative"],
  },
  {
    title: "Rabobank Retail and Business App",
    description:
      "Bunq and Moneybox integrations, business accounts, report download using micro UIs.",
    problem: "New banking features had to ship without tying every change to one large frontend.",
    approach: "Micro UIs for Bunq, Moneybox, business accounts, and report download, covered with Jest.",
    impact: "Integrations and reports could be released as independent interface slices.",
    role: "Micro-frontend delivery",
    tags: ["Angular", "Micro Frontends", "Jest"],
  },
  {
    title: "CheckIn (Apple campuses)",
    description:
      "iPad app with a React console, Express APIs, scaled and cached MySQL.",
    problem:
      "People booked rooms in iCal and then did not show up, and some meetings ended much earlier than scheduled, so rooms stayed blocked. CheckIn frees a room if nobody checks in within a 7-minute grace period, so someone else can use it or take it over.",
    approach:
      "Booked meetings are stored in MySQL from push notifications. Express APIs fetch those records and show them on the iPad.",
    impact:
      "Meeting rooms were used more efficiently by releasing unattended bookings after the grace period and making rooms available to others sooner.",
    role: "App, API, and data-tier scaling",
    tags: ["React", "Express", "MySQL", "Memcached"],
  },
];

export const skills: Record<string, string[]> = {
  Frontend: ["React", "TypeScript", "Vite", "Angular", "RxJS", "Micro Frontend"],
  Backend: ["FastAPI", "Node.js", "Pydantic", "Kafka", "Microservices", "OpenAPI"],
  Databases: ["PostgreSQL", "Redis", "Neo4j", "MySQL", "MongoDB", "Memcached"],
  AI: ["Generative AI", "Knowledge Graphs", "SageMaker", "Bedrock Agents", "Knowledge Bases", "OpenSearch"],
  "Cloud & DevOps": ["AWS", "Terraform", "ECS Fargate", "Docker", "Kubernetes", "GitHub Actions", "SQS", "Istio", "GCP"],
};

export type ExperienceItem = {
  company: string;
  title: string;
  period: string;
  story: string;
};

export const experience: ExperienceItem[] = [
  {
    company: "Sri Ramakrishna Engineering College",
    title: "B.Tech, Information Technology",
    period: "2005",
    story: "2005. B.Tech in Information Technology at Sri Ramakrishna Engineering College.",
  },
  {
    company: "Metamorphosis, Dubai",
    title: "Software Engineer",
    period: "Nov 2007 - Oct 2008",
    story: "Then joined Metamorphosis in Dubai as a Software Engineer.",
  },
  {
    company: "Logica",
    title: "IT Consultant",
    period: "Nov 2010 - Apr 2013",
    story: "Next, an IT Consultant at Logica.",
  },
  {
    company: "Wipro",
    title: "Tech Lead",
    period: "Mar 2013 - Jan 2018",
    story: "Then a Tech Lead at Wipro.",
  },
  {
    company: "Cognizant",
    title: "Senior Associate",
    period: "Feb 2018 - Sep 2021",
    story: "Then a Senior Associate at Cognizant.",
  },
  {
    company: "EPAM Anywhere",
    title: "Lead Software Engineer",
    period: "Jan 2022 - present",
    story: "Now a Lead Software Engineer at EPAM Anywhere.",
  },
];

export const contact = {
  email: "vino.mib@gmail.com",
  phone: "+918056000041",
  phoneDisplay: "+91 80560 00041",
  address: "Ramaniyam Pushkar, Kalaignar Karunanidhi Salai, Sholinganallur, Chennai",
  linkedin: "https://www.linkedin.com/in/gritbee",
  github: "https://github.com/vino-mib",
};
