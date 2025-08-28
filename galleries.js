const folderLink = "https://drive.google.com/drive/u/1/folders/1kMu_zOXXGcL9dHAfIBFY5kn_AOqayJnW";
const apiKey = "AIzaSyCdwuZY5qZgtPKNrtJvXDGdWsnP_IxgmKk";

// Function to extract folder ID from Google Drive link
function getFolderIdFromLink(link) {
  const match = link.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

const folderId = getFolderIdFromLink(folderLink);

async function fetchImages() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,mimeType,webContentLink,thumbnailLink)`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    const gallery = document.getElementById("gallery");

    if (data.files && data.files.length > 0) {
      data.files.forEach(file => {
        const img = document.createElement("img");
        img.src = file.thumbnailLink || file.webContentLink;
        img.alt = file.name;
        img.style.maxWidth = "200px";
        img.style.margin = "5px";
        gallery.appendChild(img);
      });
    } else {
      gallery.textContent = "No images found in this folder.";
    }
  } catch (err) {
    console.error("Error fetching images:", err);
  }
}

// Load images on page load
document.addEventListener("DOMContentLoaded", fetchImages);
