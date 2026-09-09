import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/aanvraag",
          "/hoe-werkt-het",
          "/diensten",
          "/voor-vakmannen",
          "/aanmelden-vakman",
          "/dakdekker",
          "/dakdekker/daklekkage",
          "/dakdekker/dakrenovatie",
          "/dakdekker/dakpannen-vervangen",
          "/dakdekker/plat-dak",
          "/dakdekker/schoorsteen",
          "/kosten",
          "/over-vakconnect",
          "/contact",
          "/privacy",
        ],
        disallow: ["/admin", "/admin/*", "/vakman", "/vakman/*", "/login"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
