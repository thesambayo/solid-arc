import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import devtools from "solid-devtools/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// https://vitejs.dev/config/
// `command` is "serve" during `vite` (dev) and "build" during `vite build`.
// Code-splitting routes breaks solid HMR (each route becomes a ?tsr-split
// chunk that isn't a refresh boundary), so we only enable it for builds.
export default defineConfig(({ command }) => {
  return {
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackRouter({
        target: "solid",
        autoCodeSplitting: command === "build",
      }),
      solid({ hot: true }),
    ],
    build: {
      target: "esnext",
    },
    server: {
      port: 9500,
    },
  };
});
