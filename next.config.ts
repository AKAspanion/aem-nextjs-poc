import type { NextConfig } from "next";

// Parse AEM host URLs from env vars to build remotePatterns for next/image.
// Supports both author (AEM_HOST) and publish (NEXT_PUBLIC_AEM_HOST) instances.
function aemHostnames(): string[] {
  const hosts: string[] = [];
  const envVars = [process.env.AEM_HOST, process.env.NEXT_PUBLIC_AEM_HOST];
  for (const raw of envVars) {
    if (!raw) continue;
    try {
      hosts.push(new URL(raw).hostname);
    } catch {
      // ignore malformed URLs during config load
    }
  }
  return [...new Set(hosts)];
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: aemHostnames().map((hostname) => ({
      protocol: "https",
      hostname,
      pathname: "/content/dam/**",
    })),
  },
};

export default nextConfig;
