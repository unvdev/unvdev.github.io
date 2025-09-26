// document.addEventListener("DOMContentLoaded", async () => {
//     const targetPage = '/test';
//     if (!targetPage) return console.error("Please enter a page path.");

//     try {
//         const res = await fetch(targetPage);
//         if (!res.ok) throw new Error(`HTTP error ${res.status}`);
//         const html = await res.text();

//         deselectAll();
//         loadedPage.innerHTML = '';
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(html, 'text/html');

//         doc.head.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
//             if (!document.head.querySelector(`link[href="${l.href}"]`)) document.head.appendChild(l);
//         });
//         doc.head.querySelectorAll('style').forEach(s => document.head.appendChild(s));

//         const bodyNodes = Array.from(doc.body.childNodes).filter(n => n.nodeName !== 'SCRIPT');
//         bodyNodes.forEach(n => loadedPage.appendChild(n));

//         setTimeout(() => {
//             Array.from(doc.body.querySelectorAll('script')).forEach(s => {
//                 const newScript = document.createElement('script');
//                 if (s.src) newScript.src = s.src;
//                 else newScript.textContent = s.textContent;
//                 loadedPage.appendChild(newScript);
//             });
//         }, 50);

//     } catch (err) {
//         console.error("Error fetching page:", err);
//     }
// });
document.addEventListener("DOMContentLoaded", async () => {
    const targetPage = '/test'; // e.g., '/test.html'
    if (!targetPage) {
        return console.error("Please set a target page path.");
    }

    try {
        // --- 1. CAPTURE ORIGINAL PAGE STATE ---
        // Capture all nodes from the original body to be re-inserted later.
        const originalCmsBodyNodes = Array.from(document.body.childNodes);
        // Capture original stylesheets and style tags to be merged.
        const originalStylesheets = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'));
        const originalStyles = Array.from(document.head.querySelectorAll('style'));
        // Capture all scripts from the original page for re-execution.
        const originalScripts = Array.from(document.scripts);

        // --- 2. FETCH AND PARSE THE NEW PAGE ---
        const response = await fetch(targetPage);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // --- 3. MERGE HEADS ---
        // We will use the new page's head as the base.
        // Now, merge in any stylesheets from the original page that don't already exist in the new one.
        originalStylesheets.forEach(link => {
            if (!doc.head.querySelector(`link[href="${link.href}"]`)) {
                doc.head.appendChild(link.cloneNode(true));
            }
        });

        // Also merge in any inline <style> blocks from the original page.
        originalStyles.forEach(style => {
            doc.head.appendChild(style.cloneNode(true));
        });

        // Completely replace the old head with our newly merged head.
        document.head.innerHTML = doc.head.innerHTML;

        // --- 4. REBUILD THE BODY ---
        const loadedPageWrapper = document.createElement('div');
        loadedPageWrapper.id = 'loaded-page';
        loadedPageWrapper.innerHTML = doc.body.innerHTML;

        // Clear the current body.
        document.body.innerHTML = '';

        // Append the original CMS content first.
        originalCmsBodyNodes.forEach(node => {
            document.body.appendChild(node);
        });

        // Append the new, wrapped content second.
        document.body.appendChild(loadedPageWrapper);

        // --- 5. MERGE AND EXECUTE SCRIPTS ---
        // Combine scripts from the original page and the newly loaded page.
        const newScripts = Array.from(doc.querySelectorAll('script'));
        const allScriptsToExecute = [...originalScripts, ...newScripts];

        allScriptsToExecute.forEach(script => {
            const newScript = document.createElement('script');
            // Copy all attributes (src, type, async, defer, etc.)
            for (const attr of script.attributes) {
                newScript.setAttribute(attr.name, attr.value);
            }
            // Copy inline script content
            if (script.textContent) {
                newScript.textContent = script.textContent;
            }
            // Appending the new script element to the body causes it to be executed.
            document.body.appendChild(newScript);
        });

    } catch (error) {
        console.error("Error loading or merging page:", error);
    }
});