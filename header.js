async function getPagesFromSitemap() {
    try {
        const response = await fetch('/sitemap.xml');
        const xmlText = await response.text();
        
        const parser = new DOMParser();
        const sitemap = parser.parseFromString(xmlText, "application/xml");
        
        const urls = Array.from(sitemap.querySelectorAll("loc")).map(loc => loc.textContent);
        
        console.log("Pages found in sitemap.xml:", urls);
        return urls;
    } catch (error) {
        console.error("Could not fetch or parse sitemap.xml:", error);
    }
}

getPagesFromSitemap();