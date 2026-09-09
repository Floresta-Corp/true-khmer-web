import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Build for the Workers runtime instead of the Node server. Set by the
// `build:cf` / `dev:cf` scripts, and by the build command Cloudflare Workers
// Builds runs -- the Dokploy/Docker deploy keeps using the plain Node build.
const isCloudflare = process.env.BUILD_TARGET === "cloudflare";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Only inline the variables that actually have a value at build time.
  // Defining a missing one would replace `process.env.X` with the literal
  // `undefined` and shadow the value the host supplies at runtime -- on
  // Workers these come from the Worker's vars and secrets, not the build.
  const serverEnv = [
    "API_BASE_URL",
    "SESSION_SECRET",
    "PLUMPI_ENDPOINT",
    "VITE_PLUMPI_WEB",
    "VITE_GOOGLE_CLIENT_ID",
    "VITE_R2_PUBLIC_BASE_URL",
  ];

  return {
    build: {
      sourcemap: mode === "development",
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === "EMPTY_BUNDLE") return;
          warn(warning);
        },
      },
    },
    server: {
      port: 3001,
      host: true,
      strictPort: true,
    },
    preview: {
      port: 3001,
      host: true,
      strictPort: true,
    },
    plugins: [
      ...(isCloudflare
        ? [cloudflare({ viteEnvironment: { name: "ssr" } }) as Plugin[]]
        : []),
      tailwindcss(),
      reactRouter(),
      tsconfigPaths(),
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
      ...Object.fromEntries(
        serverEnv
          .filter((name) => env[name])
          .map((name) => [`process.env.${name}`, JSON.stringify(env[name])]),
      ),
    },
  };
});
