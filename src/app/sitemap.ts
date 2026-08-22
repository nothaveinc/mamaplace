import type { MetadataRoute } from "next";
import { fetchFacilities } from "@/data/facilities";

const SITE_URL = "https://mamaplace.jp";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const facilities = await fetchFacilities();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search/`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/faq/`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/listing/`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact/`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const facilityPages: MetadataRoute.Sitemap = facilities.map((facility) => ({
    url: `${SITE_URL}/facility/${facility.id}/`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...facilityPages];
}
