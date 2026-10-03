import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://qr.beyondtheinnovation.com/sitemap.xml",
    host: "https://qr.beyondtheinnovation.com",
  };
}
