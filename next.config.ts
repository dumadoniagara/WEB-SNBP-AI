import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle (.next/standalone) so the Docker
  // runtime image stays tiny — no need to ship node_modules.
  output: "standalone",
};

export default nextConfig;
