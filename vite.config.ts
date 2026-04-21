import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
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
