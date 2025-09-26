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

        // --- 3. REBUILD BODY & EXTRACT SCRIPTS FROM NEW CONTENT ---
        const originalCmsBodyNodes = Array.from(document.body.childNodes);
        const loadedPageWrapper = document.createElement('div');
        loadedPageWrapper.id = 'loaded-page';
        loadedPageWrapper.innerHTML = doc.body.innerHTML;

        // NEW: Find all scripts within the new content...
        const scriptsFromLoadedPage = Array.from(loadedPageWrapper.querySelectorAll('script'));
        // ...and remove them from the wrapper so they can be moved.
        scriptsFromLoadedPage.forEach(script => script.remove());

        document.body.innerHTML = '';
        originalCmsBodyNodes.forEach(node => document.body.appendChild(node));
        document.body.appendChild(loadedPageWrapper);

        // --- 4. APPEND REQUIRED ASSETS ---
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

        const loadAppendedAssets = async (scriptsToMove) => {
            loadStylesheet('cms.css');
            loadStylesheet('https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css');

            // NEW: Add cms-loader.js specifically to the <head>
            const loaderScript = document.createElement('script');
            loaderScript.src = 'cms-loader.js';
            document.head.appendChild(loaderScript);

            try {
                // Load core scripts sequentially in the body
                await loadScript('https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js');
                await loadScript('cms-core.js');
                await loadScript('cms-menu.js');
                await loadScript('cms-text-editor.js');
                await loadScript('buildingblocks.js');

                // Execute the inline validation script
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

                // NEW: Move and execute the scripts found in the loaded page content
                scriptsToMove.forEach(script => {
                    const newScript = document.createElement('script');
                    for (const attr of script.attributes) {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                    if (script.textContent) {
                        newScript.textContent = script.textContent;
                    }
                    document.body.appendChild(newScript);
                });

            } catch (error) {
                console.error("Failed to load appended scripts:", error);
            }
        };
        
        // Pass the extracted scripts to the asset loader function
        await loadAppendedAssets(scriptsFromLoadedPage);

    } catch (error) {
        console.error("Error during page load process:", error);
    }
});