import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";
import { getAllServiceRoutes } from "@/lib/content/service-pages";
import { getIndexableSeoLocalRoutes } from "@/lib/seo/local-pages/queries";
import { getPublishedProvinceHubs } from "@/lib/seo/province-hubs";

const baseRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/aanvraag", priority: 0.95, changeFrequency: "weekly" },
  { path: "/hoe-werkt-het", priority: 0.8, changeFrequency: "monthly" },
  { path: "/diensten", priority: 0.85, changeFrequency: "weekly" },
  { path: "/regios", priority: 0.82, changeFrequency: "weekly" },
  { path: "/voor-vakmannen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/aanmelden-vakman", priority: 0.75, changeFrequency: "monthly" },
  { path: "/kosten", priority: 0.74, changeFrequency: "monthly" },
  { path: "/over-vakconnect", priority: 0.72, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.5, changeFrequency: "yearly" },
];

const serviceRoutes = getAllServiceRoutes().map((path) => ({
  path,
  priority: path.split("/").length > 2 ? 0.78 : 0.9,
  changeFrequency: "monthly" as const,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [localRoutes, provinceHubRoutes] = await Promise.all([
    getIndexableSeoLocalRoutes(),
    getPublishedProvinceHubs(),
  ]);

  const mappedLocalRoutes = localRoutes.map((path) => ({
    path,
    priority: path.split("/").length > 3 ? 0.73 : 0.8,
    changeFrequency: "weekly" as const,
  }));

  const mappedProvinceRoutes = provinceHubRoutes.map((hub) => ({
    path: `/regios/${hub.slug}`,
    priority: 0.76,
    changeFrequency: "weekly" as const,
  }));

  const publicRoutes = [...baseRoutes, ...serviceRoutes, ...mappedLocalRoutes, ...mappedProvinceRoutes].filter(
    (route, index, routes) => routes.findIndex((candidate) => candidate.path === route.path) === index,
  );

  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
