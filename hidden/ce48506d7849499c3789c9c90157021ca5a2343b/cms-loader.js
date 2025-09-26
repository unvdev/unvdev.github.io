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
    // The page whose content you want to load.
    const targetPage = '/test'; // e.g., '/test.html'
    if (!targetPage) {
        return console.error("Please set a target page path.");
    }

    try {
        // --- 1. FETCH AND REBUILD PAGE BODY (Same as before) ---
        const response = await fetch(targetPage);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const originalCmsBodyNodes = Array.from(document.body.childNodes);
        const loadedPageWrapper = document.createElement('div');
        loadedPageWrapper.id = 'loaded-page';
        loadedPageWrapper.innerHTML = doc.body.innerHTML;

        document.body.innerHTML = '';
        originalCmsBodyNodes.forEach(node => document.body.appendChild(node));
        document.body.appendChild(loadedPageWrapper);


        // --- 2. DYNAMICALLY LOAD NEW STYLES AND SCRIPTS ---

        // Helper function to append a stylesheet to the <head>
        const loadStylesheet = (href) => {
            if (!document.head.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            }
        };

        // Helper function to load a script and wait for it to finish
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => resolve(script);
                script.onerror = () => reject(new Error(`Script load error for ${src}`));
                document.body.appendChild(script);
            });
        };
        
        // --- An async function to load all assets in order ---
        const loadAssets = async () => {
            // Append stylesheets
            loadStylesheet('cms.css');
            loadStylesheet('https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css');

            // Load scripts sequentially
            try {
                await loadScript('https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js');
                // Note: 'cms-loader.js' is skipped to prevent it from re-running itself in a loop.
                await loadScript('cms-core.js');
                await loadScript('cms-menu.js');
                await loadScript('cms-text-editor.js');
                await loadScript('buildingblocks.js');

                // Finally, create and execute your inline script for validation
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
                console.error("Failed to load required scripts:", error);
            }
        };
        
        // Start loading all the new assets
        await loadAssets();

    } catch (error) {
        console.error("Error loading or merging page:", error);
    }
});