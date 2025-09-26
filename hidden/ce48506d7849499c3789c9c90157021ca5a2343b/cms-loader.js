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
    const targetPage = '/test'; // The page to load content and head from
    if (!targetPage) {
        return console.error("Please set a target page path.");
    }

    try {
        // --- 1. FETCH AND PARSE THE NEW PAGE ---
        const response = await fetch(targetPage);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // --- 2. REPLACE THE ENTIRE HEAD ---
        // The head from the /test page completely overwrites the original head.
        document.head.innerHTML = doc.head.innerHTML;

        // --- 3. REBUILD THE BODY (Same as before) ---
        const originalCmsBodyNodes = Array.from(document.body.childNodes);
        const loadedPageWrapper = document.createElement('div');
        loadedPageWrapper.id = 'loaded-page';
        loadedPageWrapper.innerHTML = doc.body.innerHTML;

        document.body.innerHTML = '';
        originalCmsBodyNodes.forEach(node => document.body.appendChild(node));
        document.body.appendChild(loadedPageWrapper);

        // --- 4. APPEND REQUIRED ASSETS ---
        // These will be added to the new head and body after they are in place.

        const loadStylesheet = (href) => {
            if (!document.head.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        };

        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve(script);
                script.onerror = () => reject(new Error(`Script load error for ${src}`));
                document.body.appendChild(script);
            });
        };

        const loadAppendedAssets = async () => {
            // Append the defined stylesheets to the new head
            loadStylesheet('cms.css');
            loadStylesheet('https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css');

            // Load the defined scripts sequentially
            try {
                await loadScript('https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js');
                await loadScript('cms-core.js');
                await loadScript('cms-menu.js');
                await loadScript('cms-text-editor.js');
                await loadScript('buildingblocks.js');

                const inlineScript = document.createElement('script');
                inlineScript.textContent = `
                    let paramString = window.location.search.split('?')[1];
                    let queryString = new URLSearchParams(paramString);
                    let nva = parseInt(queryString.get('nva'));
                    if (Number.isNaN(nva) || new Date().getTime() > nva) {
                        window.location.href = '/cms_login';
                    }
                `;
                document.body.appendChild(inlineScript);
            } catch (error) {
                console.error("Failed to load appended scripts:", error);
            }
        };
        
        await loadAppendedAssets();

    } catch (error) {
        console.error("Error during page load process:", error);
    }
});