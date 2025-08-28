const folderId = "YOUR_FOLDER_ID";
const apiKey = "YOUR_API_KEY";

async function getFolderImages() {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`);
    const data = await response.json();

    const gallery = document.getElementById("gallery");

    data.files.forEach(file => {
        if(file.mimeType.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = `https://drive.google.com/uc?export=view&id=${file.id}`;
            img.alt = file.name;
            img.style.width = "200px";
            img.style.margin = "5px";
            gallery.appendChild(img);
        }
    });
}

getFolderImages();
