import type { Config } from "@react-router/dev/config";

// Matches the BUILD_TARGET check in vite.config.ts: the Cloudflare Vite plugin
// drives the SSR build through Vite's Environment API, which this flag enables.
const isCloudflare = process.env.BUILD_TARGET === "cloudflare";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    v8_viteEnvironmentApi: isCloudflare,
  },
  // Allows action requests forwarded through the VS Code dev tunnel used to
  // test the OAuth popup flow against the true-khmer-auth example app, whose
  // Host header doesn't match the tunnel's public Origin.
  // allowedActionOrigins: ["b9q2j1s6-3001.asse.devtunnels.ms"],
} satisfies Config;
