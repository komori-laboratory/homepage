import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://komori-lab.com",
  trailingSlash: "always",
  integrations: [sitemap()],
  redirects: {
    "/company/": "/profile/",
    "/contact/": "/contactus/",
    "/privacy-policy/": "/privacy/",
    "/news/": "/activities/"
  }
});
