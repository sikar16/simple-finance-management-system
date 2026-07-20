import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcrypt", "@prisma/client"],
  output: "standalone",
};

export default nextConfig;
