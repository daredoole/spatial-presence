import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "frontend/src/spatial-presence-card.ts"),
      formats: ["es"],
      fileName: () => "spatial-presence-card.js",
    },
    outDir: resolve(
      __dirname,
      "custom_components/spatial_presence/frontend",
    ),
    emptyOutDir: true,
    sourcemap: true,
  },
  test: {
    include: ["frontend/test/**/*.test.ts"],
  },
});

