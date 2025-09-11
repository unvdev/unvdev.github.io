const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor");
let activeTextElement = null;
let quillEditor = null; // Don't initialize Quill yet
let isEditorLoading = false; // 👈 Add this line

const Font = Quill.import("formats/font");
Font.whitelist = [
  "agbalumo",
  "alumni-sans-pinstripe",
  "baskervville",
  "baskervville-sc",
  "bebas-neue",
  "borel",
  "cal-sans",
  "caveat-brush",
  "chewy",
  "cinzel",
  "comfortaa",
  "coming-soon",
  "delius",
  "dynapuff",
  "fugaz-one",
  "funnel-display",
  "germania-one",
  "google-sans-code",
  "host-grotesk",
  "lato",
  "lexend",
  "libre-bodoni",
  "lobster",
  "lora",
  "marck-script",
  "meow-script",
  "merriweather-sans",
  "michroma",
  "montecarlo",
  "newsreader",
  "noto-sans",
  "pacifico",
  "pixelify-sans",
  "playwrite-za",
  "poller-one",
  "quintessential",
  "roboto",
  "short-stack",
  "sono",
  "suse",
  "twinkle-star",
  "ultra",
  "unifrakturmaguntia",
];
Quill.register(Font, true);

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
          [{ font: Font.whitelist }],   // 👈 add this line
          [{ header: [1, 2, 3, 4, 5, false] }, { align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, "custom-color"],
          ["link"],
          ["clean"],
          ["day-mode", "night-mode"]
        ],
        handlers: {
          "custom-color": customColorPicker,
          "day-mode": setDayMode,
          "night-mode": setNightMode,
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
}

// Open editor
function openTextEditor(target) {
  isEditorLoading = true; // 👈 Set the busy flag
  activeTextElement = target;
  editorPop.classList.remove("content-hide");
  editorPop.classList.add("content-show");

if (!quillEditor) {
  initializeQuill();
  quillEditor.format('font', 'roboto', 'user'); 
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

// Click outside to save & close
document.addEventListener("click", (e) => {
  const isEditorVisible =
    window.getComputedStyle(editorPop).display !== "none";

  // 👇 Add the check here
  if (isEditorVisible && !isEditorLoading) {
    const isClickInsideEditor = e.target.closest(".text-editor-pop");
    const isClickInsideQuillUI = e.target.closest(".ql-picker, .ql-tooltip");

    if (!isClickInsideEditor && !isClickInsideQuillUI) {
      closeTextEditor(true);
    }
  }
});