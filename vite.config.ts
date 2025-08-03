import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      external: ["@prisma/client"],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "lucide-react"],
  },
  ssr: {
    noExternal: ["lucide-react"],
  },
});