const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor");
let activeTextElement = null;
let quillEditor = null; // Don't initialize Quill yet
let isEditorLoading = false; // 👈 Add this line

// 1. Define your master list of fonts
const fontWhitelist = [
  "agbalumo", "alumni-sans-pinstripe", "baskervville", "baskervville-sc",
  "bebas-neue", "borel", "cal-sans", "caveat-brush", "chewy", "cinzel",
  "comfortaa", "coming-soon", "delius", "dynapuff", "fugaz-one",
  "funnel-display", "germania-one", "google-sans-code", "host-grotesk",
  "lato", "lexend", "libre-bodoni", "lobster", "lora", "marck-script",
  "meow-script", "merriweather-sans", "michroma", "montecarlo",
  "newsreader", "noto-sans", "pacifico", "pixelify-sans", "playwrite-za",
  "poller-one", "quintessential", "roboto", "short-stack", "sono", "suse",
  "twinkle-star", "ultra", "unifrakturmaguntia",
];

// 2. Define the map for multi-word font names to help Quill's detection
const fontStyleMap = {
  'Alumni Sans Pinstripe': 'alumni-sans-pinstripe',
  'Baskervville SC': 'baskervville-sc',
  'Bebas Neue': 'bebas-neue',
  'Cal Sans': 'cal-sans',
  'Caveat Brush': 'caveat-brush',
  'Coming Soon': 'coming-soon',
  'Funnel Display': 'funnel-display',
  'Google Sans Code': 'google-sans-code',
  'Libre Bodoni': 'libre-bodoni',
  'Marck Script': 'marck-script',
  'Meow Script': 'meow-script',
  'Merriweather Sans': 'merriweather-sans',
  'Pixelify Sans': 'pixelify-sans',
  'Playwrite ZA': 'playwrite-za',
  'Poller One': 'poller-one',
  'Short Stack': 'short-stack',
  'Twinkle Star': 'twinkle-star',
};

// 3. Get Quill's default Font class
const Font = Quill.import('formats/font');

// 4. Create a custom Font class that overrides the faulty detection logic
class CustomFont extends Font {
  static formats(domNode) {
    // Ask the browser for the real font name
    const fontName = window.getComputedStyle(domNode).getPropertyValue('font-family').split(',')[0].replace(/['"]/g, '').trim();

    // Look up the real name in our map
    if (fontStyleMap[fontName]) {
      return fontStyleMap[fontName];
    }
    
    // For simple, single-word fonts, try a direct lowercase match
    const simpleMatch = fontName.toLowerCase();
    if (fontWhitelist.includes(simpleMatch)) {
      return simpleMatch;
    }

    // Fallback to Quill's original method if our lookup fails
    return super.formats(domNode);
  }
}
CustomFont.whitelist = fontWhitelist;

// 5. Register our custom class, overriding Quill's default 'font' handler
Quill.register(CustomFont, true);

// Custom color picker
function customColorPicker() {
  const color = prompt("Enter a hex color code (e.g., #ff00ff):");
  if (color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    quillEditor.format("color", color);
  } else if (color) {
    alert("Invalid hex code.");
  }
}

// Day/Night mode handlers
function setDayMode() {
  editorPop.style.backgroundColor = "whitesmoke";
}
function setNightMode() {
  editorPop.style.backgroundColor = "#222222";
}

// Initialize Quill
function initializeQuill() {
  quillEditor = new Quill(editorContainer, {
    theme: "snow",
    modules: {
      toolbar: {
        container: [
          // This is the line to fix 👇
          [{ font: fontWhitelist }],
          [{ header: [1, 2, 3, 4, 5, false] }, { align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, "custom-color"],
          ["link"],
          ["clean"],
          ["day-mode", "night-mode"],
          ["close"]
        ],
        handlers: {
          "custom-color": customColorPicker,
          "day-mode": setDayMode,
          "night-mode": setNightMode,
          "close": closeTextEditor,
        },
      },
    },
  });

  // Style custom buttons
  document.querySelector(".ql-custom-color").innerHTML =
    '<i class="fa-solid fa-palette"></i>';
  document.querySelector(".ql-day-mode").innerHTML =
    '<i class="fa-solid fa-sun"></i>';
  document.querySelector(".ql-night-mode").innerHTML =
    '<i class="fa-solid fa-moon"></i>';
  document.querySelector(".ql-close").innerHTML =
    '<i class="fa-solid fa-xmark"></i>';
}

// Open editor
function openTextEditor(target) {
  isEditorLoading = true; // 👈 Set the busy flag
  activeTextElement = target;
  editorPop.classList.remove("content-hide");
  editorPop.classList.add("content-show");

if (!quillEditor) {
  initializeQuill();
}
  requestAnimationFrame(() => {
    const content = target.innerHTML.trim();
    quillEditor.setContents([], "silent");
    quillEditor.clipboard.dangerouslyPasteHTML(0, content, "silent");

    quillEditor.enable(true);
    const length = quillEditor.getLength();
    quillEditor.setSelection(length, 0, "silent");
    quillEditor.focus();
    
    isEditorLoading = false; // 👈 Release the flag when done
  });
}

// Utility: remove empty tags
function cleanHtml(html) {
  const trimmed = html.trim();
  const noEmptyTags = trimmed.replace(
    /<(\w+)(?:\s[^>]*)?>\s*(<br\s*\/?>)?\s*<\/\1>/gi,
    ""
  );
  return noEmptyTags.trim();
}

// Utility: normalize Quill lists into proper ul/ol
function normalizeLists(html) {
  return html.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, inner) => {
    if (/data-list="bullet"/.test(match)) {
      return `<ul>${inner.replace(/ data-list="bullet"/g, "")}</ul>`;
    }
    return `<ol>${inner.replace(/ data-list="ordered"/g, "")}</ol>`;
  });
}

// Close editor
function closeTextEditor(save = true) {
  if (!activeTextElement || !quillEditor) return;

  if (save) {
    let newContent = quillEditor.root.innerHTML;

    // Normalize lists + clean empty tags
    newContent = normalizeLists(newContent);
    const cleaned = cleanHtml(newContent);

    if (cleaned) {
      activeTextElement.innerHTML = cleaned;
    }
  }

  editorPop.classList.remove("content-show");
  editorPop.classList.add("content-hide");
  activeTextElement = null;
}

// Double-click to open editor
document.addEventListener("dblclick", (e) => {
  const target = e.target.closest(".text-element");
  if (target) openTextEditor(target);
});

// // Click outside to save & close
// document.addEventListener("click", (e) => {
//   const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";

//   // Only proceed if the editor is visible AND not busy loading
//   if (isEditorVisible && !isEditorLoading) {
//     const isClickInsideEditor = e.target.closest(".text-editor-pop");
//     const isClickInsideQuillUI = e.target.closest(".ql-picker, .ql-tooltip");

//     if (!isClickInsideEditor && !isClickInsideQuillUI) {
//       closeTextEditor(true);
//     }
//   }
// });