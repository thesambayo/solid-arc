import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 80,
  htmlWhitespaceSensitivity: "ignore",
  sortTailwindcss: {
    stylesheet: "./src/styles/styles.css",
    functions: ["clsx", "cn"],
    preserveWhitespace: false,
  },
  sortImports: {
    order: "asc",
  },
  // sortImports: {
  //   newlinesBetween: false,
  //   groups: [
  //     ["value-builtin", "value-external"],
  //     ["value-internal", "value-parent", "value-sibling", "value-index"],
  //     { newlinesBetween: true },
  //     "type-import",
  //     "unknown",
  //   ],
  // },
});
