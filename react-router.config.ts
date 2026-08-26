import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // Allows action requests forwarded through the VS Code dev tunnel used to
  // test the OAuth popup flow against the true-khmer-auth example app, whose
  // Host header doesn't match the tunnel's public Origin.
  // allowedActionOrigins: ["b9q2j1s6-3001.asse.devtunnels.ms"],
} satisfies Config;
