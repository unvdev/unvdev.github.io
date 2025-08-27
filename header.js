async function getNavPagesFromSitemap() {
    try {
        const response = await fetch('/sitemap.xml');
        const xmlText = await response.text();

        const parser = new DOMParser();
        const sitemap = parser.parseFromString(xmlText, "application/xml");

        const urls = Array.from(sitemap.querySelectorAll("url")).map(urlNode => ({
            loc: urlNode.querySelector("loc")?.textContent,
            title: urlNode.querySelector("title")?.textContent,
            nav: urlNode.querySelector("nav")?.textContent === "true"
        }));

        console.log("Pages in sitemap:", urls);
        return urls;
    } catch (error) {
        console.error("Could not fetch or parse sitemap.xml:", error);
    }
}

getNavPagesFromSitemap();