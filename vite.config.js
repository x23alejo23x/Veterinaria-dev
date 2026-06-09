import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({
      presets: [reactCompilerPreset()],
      exclude: [/node_modules/],
    }),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 6358,
  },
});
