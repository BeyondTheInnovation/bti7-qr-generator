import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AGENTS.md is the guide; keep `next dev` from writing its own block into it.
  agentRules: false,
  output: "export",
};

export default nextConfig;
