import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import fs from "fs";

async function markNavPages() {
  const sitemap = fs.readFileSync("sitemap.xml", "utf-8");
  const domParser = new JSDOM(sitemap, { contentType: "application/xml" });
  const urlNodes = domParser.window.document.querySelectorAll("url");

  for (const urlNode of urlNodes) {
    const loc = urlNode.querySelector("loc").textContent.trim();

    try {
      const res = await fetch(loc);
      const html = await res.text();
      const pageDom = new JSDOM(html);

      // Look for a custom marker on the page
      if (
        pageDom.window.document.querySelector("meta[name='nav'][content='true']") ||
        pageDom.window.document.querySelector("nav[data-nav='true']")
      ) {
        const navTag = domParser.window.document.createElement("nav");
        navTag.textContent = "true";
        urlNode.appendChild(navTag);
        console.log(`✔ Marked as nav: ${loc}`);
      }
    } catch (err) {
      console.warn(`⚠ Could not check ${loc}:`, err.message);
    }
  }

  fs.writeFileSync("sitemap.xml", domParser.serialize());
  console.log("✅ sitemap.xml updated with nav markers");
}

markNavPages();
