import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = "https://cognize.live";

	return {
		rules: {
			userAgent: "*",
			allow: "/", // allow everything
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
