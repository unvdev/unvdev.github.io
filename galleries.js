const folderLink = "https://drive.google.com/drive/u/1/folders/1kMu_zOXXGcL9dHAfIBFY5kn_AOqayJnW";
const apiKey = "AIzaSyCdwuZY5qZgtPKNrtJvXDGdWsnP_IxgmKk";

// Function to extract folder ID from Google Drive link
function getFolderIdFromLink(link) {
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

const folderId = getFolderIdFromLink(folderLink);

async function fetchImages() {
  if (!folderId) {
    console.error("Invalid Google Drive folder link");
    return;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,mimeType,webContentLink,thumbnailLink)`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.files && data.files.length > 0) {
      const galleryImages = data.files.map(file => ({
        src: file.thumbnailLink || file.webContentLink,
        alt: file.name
      }));
      console.log("Gallery images:", galleryImages);
      // You can now use galleryImages array to populate your gallery
    } else {
      console.log("No images found in this folder.");
    }
  } catch (err) {
    console.error("Error fetching images:", err);
  }
}

// Load images on page load
document.addEventListener("DOMContentLoaded", fetchImages);
