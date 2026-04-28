import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      sourcemap: mode === "development",
    },
    server: {
      port: 3001,
      host: true, // This exposes the server to the local network
      strictPort: true,
    },
    preview: {
      port: 3001,
      host: true, // This exposes the preview server
      strictPort: true,
    },
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
      "process.env.API_BASE_URL": JSON.stringify(env.API_BASE_URL),
      "process.env.SESSION_SECRET": JSON.stringify(env.SESSION_SECRET),
      "process.env.PLUMPI_ENDPOINT": JSON.stringify(env.PLUMPI_ENDPOINT),
      "process.env.VITE_PLUMPI_WEB": JSON.stringify(env.VITE_PLUMPI_WEB),
      "process.env.VITE_R2_PUBLIC_BASE_URL": JSON.stringify(
        env.VITE_R2_PUBLIC_BASE_URL,
      ),
    },
  };
});
