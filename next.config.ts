import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  outputFileTracingIncludes: {
    "/tecnico/busca": [
      "./docs/**/*.md",
      "./CONTRIBUTING.md",
      "./src/domains/lesson-library/README.md",
    ],
  },
};

export default nextConfig;
