document.addEventListener("DOMContentLoaded", async () => {
    const targetPage = '/test';
    if (!targetPage) return console.error("Please enter a page path.");

    try {
        const res = await fetch(targetPage);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const html = await res.text();

        deselectAll();
        loadedPage.innerHTML = '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        doc.head.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
            if (!document.head.querySelector(`link[href="${l.href}"]`)) document.head.appendChild(l);
        });
        doc.head.querySelectorAll('style').forEach(s => document.head.appendChild(s));

        const bodyNodes = Array.from(doc.body.childNodes).filter(n => n.nodeName !== 'SCRIPT');
        bodyNodes.forEach(n => loadedPage.appendChild(n));

        setTimeout(() => {
            Array.from(doc.body.querySelectorAll('script')).forEach(s => {
                const newScript = document.createElement('script');
                if (s.src) newScript.src = s.src;
                else newScript.textContent = s.textContent;
                loadedPage.appendChild(newScript);
            });
        }, 50);

    } catch (err) {
        console.error("Error fetching page:", err);
    }
});