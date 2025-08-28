const folderLink = "https://drive.google.com/drive/folders/1kMu_zOXXGcL9dHAfIBFY5kn_AOqayJnW?usp=sharing";
const apiKey = "AIzaSyCdwuZY5qZgtPKNrtJvXDGdWsnP_IxgmKk";

// Extract folder ID from a Google Drive folder link
function getFolderIdFromLink(link) {
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Remove '=sXXX' size parameter from Google Drive URLs
function stripSizeParam(url) {
  return url.replace(/=s\d+$/, '');
}

const folderId = getFolderIdFromLink(folderLink);

async function fetchImages() {
  if (!folderId) {
    console.error("Invalid Google Drive folder link");
    return;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,mimeType,webContentLink,thumbnailLink)`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.files && data.files.length > 0) {
      const galleryImages = data.files.map(file => ({
        src: stripSizeParam(file.thumbnailLink || `https://drive.google.com/uc?id=${file.id}`),
        alt: file.name
      }));
      console.log("Gallery images:", galleryImages);
      // You can use galleryImages array to render your gallery later
    } else {
      console.log("No images found in this folder.");
    }
  } catch (err) {
    console.error("Error fetching images:", err);
  }
}

document.addEventListener("DOMContentLoaded", fetchImages);
