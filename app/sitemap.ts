// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cognize.live";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/kanban`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/kanban/:id`,
      lastModified: new Date(),
    },
  ];
}
