export type Stage = {
  title: string;
  description: string;
  scale: string;
};

export type DiagramNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  from: number;
  to: number;
  aliases?: Record<number, string>;
};

export type DiagramEdge = {
  from: string;
  to: string;
  start: number;
  end: number;
};

export const stages: Stage[] = [
  {
    title: "Single server",
    description: "Web app, database and static content on one machine.",
    scale: "1 user",
  },
  {
    title: "Separate the data tier",
    description: "Web and database now scale independently.",
    scale: "10s of users",
  },
  {
    title: "Load balancer + web tier",
    description: "Horizontal scaling with failover.",
    scale: "1,000s of users",
  },
  {
    title: "Database replication",
    description: "Primary takes writes, replicas serve reads.",
    scale: "10,000s of users",
  },
  {
    title: "Cache + CDN",
    description: "Cache hot reads, serve static assets near users.",
    scale: "100,000s of users",
  },
  {
    title: "Stateless web tier",
    description: "Session state moves to a shared store.",
    scale: "~1M users",
  },
  {
    title: "Multiple data centers",
    description: "GeoDNS routes users to the nearest region.",
    scale: "Millions of users",
  },
  {
    title: "Message queue",
    description: "Decouple producers from workers for async jobs.",
    scale: "Millions of users",
  },
  {
    title: "Logs, metrics, sharding",
    description: "Observability, automation and partitioned data.",
    scale: "Millions of users",
  },
];

export const nodes: DiagramNode[] = [
  { id: "user", label: "Users", x: 0.07, y: 0.52, from: 1, to: 9 },
  { id: "dns", label: "DNS", x: 0.12, y: 0.16, from: 1, to: 9, aliases: { 7: "GeoDNS" } },
  { id: "mono", label: "Web + DB", x: 0.27, y: 0.52, from: 1, to: 1 },
  { id: "web1", label: "Web Server", x: 0.36, y: 0.24, from: 2, to: 9 },
  { id: "lb", label: "Load Balancer", x: 0.19, y: 0.52, from: 3, to: 9 },
  { id: "web2", label: "Web Server", x: 0.36, y: 0.8, from: 3, to: 9 },
  { id: "master", label: "Primary DB", x: 0.8, y: 0.28, from: 2, to: 9 },
  { id: "rep1", label: "Replica", x: 0.92, y: 0.44, from: 4, to: 9 },
  { id: "rep2", label: "Replica", x: 0.92, y: 0.62, from: 4, to: 9 },
  { id: "cdn", label: "CDN", x: 0.3, y: 0.06, from: 5, to: 9 },
  { id: "cache", label: "Cache", x: 0.56, y: 0.24, from: 5, to: 9 },
  { id: "sess", label: "Session Store", x: 0.24, y: 0.94, from: 6, to: 9 },
  { id: "dc2", label: "Data Center 2", x: 0.88, y: 0.08, from: 7, to: 9 },
  { id: "queue", label: "Msg Queue", x: 0.52, y: 0.94, from: 8, to: 9 },
  { id: "work", label: "Workers", x: 0.72, y: 0.9, from: 8, to: 9 },
  { id: "logs", label: "Logs / Metrics / CI", x: 0.09, y: 0.9, from: 9, to: 9 },
  { id: "sh1", label: "Shard 1", x: 0.8, y: 0.76, from: 9, to: 9 },
  { id: "sh2", label: "Shard 2", x: 0.93, y: 0.88, from: 9, to: 9 },
];

export const edges: DiagramEdge[] = [
  { from: "user", to: "dns", start: 1, end: 9 },
  { from: "user", to: "mono", start: 1, end: 1 },
  { from: "user", to: "web1", start: 2, end: 2 },
  { from: "user", to: "lb", start: 3, end: 9 },
  { from: "lb", to: "web1", start: 3, end: 9 },
  { from: "lb", to: "web2", start: 3, end: 9 },
  { from: "web1", to: "master", start: 2, end: 9 },
  { from: "web2", to: "master", start: 3, end: 9 },
  { from: "master", to: "rep1", start: 4, end: 9 },
  { from: "master", to: "rep2", start: 4, end: 9 },
  { from: "web1", to: "rep1", start: 4, end: 9 },
  { from: "web2", to: "rep2", start: 4, end: 9 },
  { from: "user", to: "cdn", start: 5, end: 9 },
  { from: "web1", to: "cache", start: 5, end: 9 },
  { from: "web2", to: "cache", start: 5, end: 9 },
  { from: "web1", to: "sess", start: 6, end: 9 },
  { from: "web2", to: "sess", start: 6, end: 9 },
  { from: "dns", to: "dc2", start: 7, end: 9 },
  { from: "dc2", to: "master", start: 7, end: 9 },
  { from: "web2", to: "queue", start: 8, end: 9 },
  { from: "queue", to: "work", start: 8, end: 9 },
  { from: "work", to: "master", start: 8, end: 9 },
  { from: "logs", to: "lb", start: 9, end: 9 },
  { from: "master", to: "sh1", start: 9, end: 9 },
  { from: "master", to: "sh2", start: 9, end: 9 },
];
