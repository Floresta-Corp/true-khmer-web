import { createReadStream } from "node:fs";
import { cp } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, normalize, sep } from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isCloudflare = process.env.BUILD_TARGET === "cloudflare";

const PDFJS_BASE = "pdfjs";

const PDFJS_DIRS = ["cmaps", "iccs", "standard_fonts", "wasm"];

function pdfjsAssets(): Plugin {
  const pkg = dirname(
    createRequire(import.meta.url).resolve("pdfjs-dist/package.json"),
  );

  const assetPath = (url: string) => {
    const wanted = normalize(decodeURIComponent(url.split("?")[0])).replace(
      /^[/\\]+/,
      "",
    );

    if (!PDFJS_DIRS.includes(wanted.split(/[/\\]/)[0])) return null;

    const file = join(pkg, wanted);
    return file.startsWith(pkg + sep) ? file : null;
  };

  return {
    name: "pdfjs-assets",

    configureServer(server) {
      server.middlewares.use(`/${PDFJS_BASE}`, (req, res, next) => {
        const file = req.url && assetPath(req.url);
        if (!file) return next();

        if (file.endsWith(".wasm")) {
          res.setHeader("Content-Type", "application/wasm");
        }

        const stream = createReadStream(file);

        stream.on("error", () => {
          if (!res.headersSent) res.statusCode = 404;
          res.end();
        });

        stream.pipe(res);
      });
    },

    async writeBundle({ dir: outDir }) {
      if (this.environment.name !== "client" || !outDir) return;

      await Promise.all(
        PDFJS_DIRS.map((dir) =>
          cp(join(pkg, dir), join(outDir, PDFJS_BASE, dir), {
            recursive: true,
          }),
        ),
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

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
      pdfjsAssets(),
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
