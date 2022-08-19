import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://DarrenXu94.github.io",
  base: "/astro-docs",
  integrations: [mdx(), sitemap()],
});
