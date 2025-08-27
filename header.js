async function getNavPagesFromSitemap() {
    try {
        const response = await fetch('/sitemap.xml');
        const xmlText = await response.text();

        const parser = new DOMParser();
        const sitemap = parser.parseFromString(xmlText, "application/xml");

        const urls = Array.from(sitemap.querySelectorAll("url"))
            .filter(urlNode => urlNode.getAttribute("nav") === "true")
            .map(urlNode => urlNode.querySelector("loc").textContent);

        console.log("Navigation pages:", urls);
        return urls;
    } catch (error) {
        console.error("Could not fetch or parse sitemap.xml:", error);
    }
}

getNavPagesFromSitemap(); 

// <?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   <url nav="true">
//     <loc>https://example.com/</loc>
//     <lastmod>2025-08-27</lastmod>
//   </url>
//   <url nav="true">
//     <loc>https://example.com/about.html</loc>
//   </url>
//   <url>
//     <loc>https://example.com/privacy.html</loc>
//   </url>
// </urlset>