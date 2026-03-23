import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import { SITE } from "@/config";

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, "") ?? SITE.website.replace(/\/$/, "");

  const posts = await getCollection("blog");
  const publishedPosts = posts.filter(
    ({ data }) =>
      !data.draft &&
      new Date(data.pubDatetime).getTime() <= Date.now() + SITE.scheduledPostMargin
  );

  // Static pages
  const staticPages = [
    { url: `${baseUrl}/`, priority: "1.0", changefreq: "weekly" },
    { url: `${baseUrl}/posts/`, priority: "0.8", changefreq: "weekly" },
    { url: `${baseUrl}/tags/`, priority: "0.6", changefreq: "weekly" },
    { url: `${baseUrl}/search/`, priority: "0.5", changefreq: "monthly" },
  ];

  // Dynamic post pages
  const postPages = publishedPosts.map(({ data, id, filePath }) => ({
    url: `${baseUrl}${getPath(id, filePath)}`,
    lastmod: (data.modDatetime ?? data.pubDatetime).toISOString(),
    priority: "0.9",
    changefreq: "monthly",
  }));

  // Unique tag pages
  const allTags = [...new Set(publishedPosts.flatMap(({ data }) => data.tags))];
  const tagPages = allTags.map(tag => ({
    url: `${baseUrl}/tags/${tag}/`,
    priority: "0.5",
    changefreq: "weekly",
  }));

  const allPages = [...staticPages, ...postPages, ...tagPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages
  .map(
    page => `  <url>
    <loc>${page.url}</loc>${"lastmod" in page ? `\n    <lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
