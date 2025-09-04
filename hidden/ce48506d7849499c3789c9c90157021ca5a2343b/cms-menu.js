//Text Element Buttons
const textElementHeadingOneButton = document.getElementById("text-element-heading-one-button");
const textElementHeadingTwoButton = document.getElementById("text-element-heading-two-button");
const textElementHeadingThreeButton = document.getElementById("text-element-heading-three-button");
const textElementHeadingFourButton = document.getElementById("text-element-heading-four-button");
const textElementHeadingFiveButton = document.getElementById("text-element-heading-five-button");
const textElementParagraphButton = document.getElementById("text-element-paragraph-button");
const textElementUnorderedButton = document.getElementById("text-element-unordered-button");
const textElementOrderedButton = document.getElementById("text-element-ordered-button");
//Layout Element Buttons
const layoutElementOneColumnButton = document.getElementById("layout-element-one-column-button");
const layoutElementTwoColumnButton = document.getElementById("layout-element-two-column-button");
const layoutElementThreeColumnButton = document.getElementById("layout-element-three-column-button");
const layoutElementFourColumnButton = document.getElementById("layout-element-four-column-button");
const layoutElementFiveColumnButton = document.getElementById("layout-element-five-column-button");
const layoutElementSixColumnButton = document.getElementById("layout-element-six-column-button");
const layoutElementAsymmLeftColumnButton = document.getElementById("layout-element-asymm-left-column-button");
const layoutElementAsymmRightColumnButton = document.getElementById("layout-element-asymm-right-column-button");
//Image Element Buttons
const imageElementLinkButton = document.getElementById("image-element-link-button");
const imageElementUploadButton = document.getElementById("image-element-upload-button");

//Element Functions
function insertElement(htmlContent) {
    if (currentlySelected) {
        currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);
        cms.classList.add('content-hide');
        deselectAll();
    }
}

function insertImageLink(htmlContent) {
  if (currentlySelected) {
    currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);

    const insertedImage = currentlySelected.previousElementSibling.querySelector("img");
    const imageLink = grabImageLink();

    if (imageLink && insertedImage) {
      insertedImage.src = imageLink;
    }

    cms.classList.add("content-hide");
    deselectAll();
  }
}

async function insertImageUpload(htmlContent) {
  if (currentlySelected) {
    currentlySelected.insertAdjacentHTML("beforebegin", htmlContent);

    const insertedImage = currentlySelected.previousElementSibling.querySelector("img");
    const imageUpload = await grabImageUpload();

    if (imageUpload && insertedImage) {
      insertedImage.src = imageUpload;
    }

    cms.classList.add("content-hide");
    deselectAll();
  }
}

function insertLayoutElement(htmlContent) {
    if (currentlySelected) {
        const allBuildingContainers = document.querySelectorAll(".building-container");

        if (allBuildingContainers.length > 0) {
            const lastBuildingContainer = allBuildingContainers[allBuildingContainers.length - 1];
            lastBuildingContainer.insertAdjacentHTML('afterend', htmlContent);
        } else {
            console.warn("No '.building-container' found.");
            return;
        }

        cms.classList.add('content-hide');
        deselectAll();
    }
}

// Utilities
function grabImageLink() {
  const link = prompt("Enter a photo link:");
  const imageRegex = /\.(jpe?g|png|gif|webp|svg)(\?.*)?(#.*)?$/i;

  if (link && imageRegex.test(link)) {
    return link;
  } else if (link) {
    alert("Please enter a valid image URL (jpg, png, gif, webp, svg).");
  }

  return null;
}

function grabImageUpload() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";

    input.onchange = () => {
      const file = input.files[0];
      if (!file) {
        resolve(null);
        return;
      }

      // 2 MB limit check
      if (file.size > 2 * 1024 * 1024) {
        alert("Please upload a photo no larger than 2 MB.");
        resolve(null);
        return;
      }

      // Handle SVG directly
      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const maxSize = 1200; // max width/height
          let { width, height } = img;

          // Resize if needed
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height *= maxSize / width;
              width = maxSize;
            } else {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Determine output quality
          let mimeType = file.type;
          let quality = 1.0; // default lossless

          if (mimeType === "image/jpeg" || mimeType === "image/webp") {
            quality = 0.85; // compress JPEG/WebP
          }

          const base64 = canvas.toDataURL(mimeType, quality);
          resolve(base64);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    };

    input.click();
  });
}

async function insertImageUpload(htmlContent) {
  if (currentlySelected) {
    currentlySelected.insertAdjacentHTML("beforebegin", htmlContent);

    const insertedImage = currentlySelected.previousElementSibling.querySelector("img");
    const photoBase64 = await grabPhotoUpload();

    if (photoBase64 && insertedImage) {
      insertedImage.src = photoBase64;
    }

    cms.classList.add("content-hide");
    deselectAll();
  }
}

//Text Element Event Listeners
textElementHeadingOneButton.addEventListener('click', () => insertElement(headingOne));
textElementHeadingTwoButton.addEventListener('click', () => insertElement(headingTwo));
textElementHeadingThreeButton.addEventListener('click', () => insertElement(headingThree));
textElementHeadingFourButton.addEventListener('click', () => insertElement(headingFour));
textElementHeadingFiveButton.addEventListener('click', () => insertElement(headingFive));
textElementParagraphButton.addEventListener('click', () => insertElement(paragraph));
textElementUnorderedButton.addEventListener('click', () => insertElement(unorderedList));
textElementOrderedButton.addEventListener('click', () => insertElement(orderedList));
//Layout Element Event Listeners
layoutElementOneColumnButton.addEventListener('click', () => insertLayoutElement(oneColumn));
layoutElementTwoColumnButton.addEventListener('click', () => insertLayoutElement(twoColumns));
layoutElementThreeColumnButton.addEventListener('click', () => insertLayoutElement(threeColumns));
layoutElementFourColumnButton.addEventListener('click', () => insertLayoutElement(fourColumns));
layoutElementFiveColumnButton.addEventListener('click', () => insertLayoutElement(fiveColumns));
layoutElementSixColumnButton.addEventListener('click', () => insertLayoutElement(sixColumns));
layoutElementAsymmLeftColumnButton.addEventListener('click', () => insertLayoutElement(asymmLeftColumn));
layoutElementAsymmRightColumnButton.addEventListener('click', () => insertLayoutElement(asymmRightColumn));
//Image Element Event Listeners
imageElementLinkButton.addEventListener('click', () => insertImageLink(image));
imageElementUploadButton.addEventListener('click', () => insertImageUpload(image));

//Open The CMS Menu
function invokeCMSMenu() {
    if (currentlySelected && currentlySelected.classList.contains('placeholder-block')) {
        cms.classList.remove('content-hide');
    }
}