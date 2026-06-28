import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackRouter({ target: "solid", autoCodeSplitting: true }),
    solid({ hot: true }),
  ],
  build: {
    target: "esnext",
  },
  server: {
    port: 9500,
  },
});
