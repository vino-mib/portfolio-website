import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(githubPages
    ? {
        output: "export",
        basePath: "/portfolio",
        assetPrefix: "/portfolio/",
      }
    : {}),
  agentRules: false,
  devIndicators: false,
};

export default nextConfig;
