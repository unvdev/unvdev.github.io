const editorPop = document.querySelector(".text-editor-pop");
const editorContainer = document.querySelector("#quill-editor");
let activeTextElement = null;
let quillEditor = null; 
let isEditorLoading = false;

const Inline = Quill.import("blots/inline");

class CustomFont extends Inline {
  static blotName = "font";
  static tagName = "SPAN";
  static classPrefix = "ql-font-";

  static whitelist = [
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

  static sanitize(value) {
    if (!value) return value;
    return value.replace(/['"]/g, "").replace(/\s+/g, "-").toLowerCase();
  }

  static create(value) {
    const node = super.create();
    const normalized = this.sanitize(value);
    if (this.whitelist && !this.whitelist.includes(normalized)) return node;
    node.setAttribute("class", this.classPrefix + normalized);
    return node;
  }

  static formats(node) {
    const className = node.getAttribute("class") || "";
    const match = className.match(new RegExp(this.classPrefix + "([a-z0-9-]+)"));
    return match ? match[1] : null;
  }

  format(name, value) {
    if (name === CustomFont.blotName) {
      if (value) {
        const normalized = CustomFont.sanitize(value);
        if (CustomFont.whitelist.includes(normalized)) {
          this.domNode.setAttribute("class", CustomFont.classPrefix + normalized);
        }
      } else {
        this.domNode.removeAttribute("class");
      }
    } else {
      super.format(name, value);
    }
  }
}

Quill.register(CustomFont, true);

// Mapping for display names (so your picker label shows proper font names)
const FONT_DISPLAY_NAMES = {
  "agbalumo": "Agbalumo",
  "alumni-sans-pinstripe": "Alumni Sans Pinstripe",
  "baskervville": "Baskervville",
  "baskervville-sc": "Baskervville SC",
  "bebas-neue": "Bebas Neue",
  "borel": "Borel",
  "cal-sans": "Cal Sans",
  "caveat-brush": "Caveat Brush",
  "chewy": "Chewy",
  "cinzel": "Cinzel",
  "comfortaa": "Comfortaa",
  "coming-soon": "Coming Soon",
  "delius": "Delius",
  "dynapuff": "DynaPuff",
  "fugaz-one": "Fugaz One",
  "funnel-display": "Funnel Display",
  "germania-one": "Germania One",
  "google-sans-code": "Google Sans Code",
  "host-grotesk": "Host Grotesk",
  "lato": "Lato",
  "lexend": "Lexend",
  "libre-bodoni": "Libre Bodoni",
  "lobster": "Lobster",
  "lora": "Lora",
  "marck-script": "Marck Script",
  "meow-script": "Meow Script",
  "merriweather-sans": "Merriweather Sans",
  "michroma": "Michroma",
  "montecarlo": "MonteCarlo",
  "newsreader": "Newsreader",
  "noto-sans": "Noto Sans",
  "pacifico": "Pacifico",
  "pixelify-sans": "Pixelify Sans",
  "playwrite-za": "Playwrite ZA",
  "poller-one": "Poller One",
  "quintessential": "Quintessential",
  "roboto": "Roboto",
  "short-stack": "Short Stack",
  "sono": "Sono",
  "suse": "SUSE",
  "twinkle-star": "Twinkle Star",
  "ultra": "Ultra",
  "unifrakturmaguntia": "UnifrakturMaguntia"
};

// Custom color picker
function customColorPicker() {
  const color = prompt("Enter a hex color code (e.g., #ff00ff):");
  if (color && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    quillEditor.format("color", color);
  } else if (color) {
    alert("Invalid hex code.");
  }
}

// Day/Night mode
function setDayMode() {
  editorPop.style.backgroundColor = "whitesmoke";
}
function setNightMode() {
  editorPop.style.backgroundColor = "#222222";
}

function initializeQuill() {
  quillEditor = new Quill(editorContainer, {
    theme: "snow",
    modules: {
      toolbar: {
        container: [
          [{ font: CustomFont.whitelist }],
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
          "night-mode": setNightMode
        }
      }
    }
  });

  document.querySelector(".ql-custom-color").innerHTML =
    '<i class="fa-solid fa-palette"></i>';
  document.querySelector(".ql-day-mode").innerHTML =
    '<i class="fa-solid fa-sun"></i>';
  document.querySelector(".ql-night-mode").innerHTML =
    '<i class="fa-solid fa-moon"></i>';

  quillEditor.on("editor-change", updateFontLabel);
}

function updateFontLabel() {
  const fontPicker = document.querySelector(".ql-font");
  if (!fontPicker || !quillEditor) return;

  const format = quillEditor.getFormat();
  const currentFont = format.font || "sans-serif";
  const displayName = FONT_DISPLAY_NAMES[currentFont] || "Sans Serif";

  const label = fontPicker.querySelector(".ql-picker-label");
  if (label) {
    label.textContent = displayName;
    label.setAttribute("data-value", currentFont); // <- important
  }
}

function openTextEditor(target) {
  isEditorLoading = true;
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
    updateFontLabel();
    isEditorLoading = false;
  });
}

// Utility: remove empty tags
function cleanHtml(html) {
  const trimmed = html.trim();
  return trimmed.replace(/<(\w+)(?:\s[^>]*)?>\s*(<br\s*\/?>)?\s*<\/\1>/gi, "").trim();
}

// Normalize lists
function normalizeLists(html) {
  return html.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, inner) => {
    if (/data-list="bullet"/.test(match)) {
      return `<ul>${inner.replace(/ data-list="bullet"/g, "")}</ul>`;
    }
    return `<ol>${inner.replace(/ data-list="ordered"/g, "")}</ol>`;
  });
}

function closeTextEditor(save = true) {
  if (!activeTextElement || !quillEditor) return;

  if (save) {
    let newContent = quillEditor.root.innerHTML;
    newContent = normalizeLists(newContent);
    const cleaned = cleanHtml(newContent);
    if (cleaned) activeTextElement.innerHTML = cleaned;
  }

  editorPop.classList.remove("content-show");
  editorPop.classList.add("content-hide");
  activeTextElement = null;
}

document.addEventListener("dblclick", (e) => {
  const target = e.target.closest(".text-element");
  if (target) openTextEditor(target);
});

document.addEventListener("click", (e) => {
  const isEditorVisible = window.getComputedStyle(editorPop).display !== "none";

  if (isEditorVisible && !isEditorLoading) {
    const isClickInsideEditor = e.target.closest(".text-editor-pop");
    const isClickInsideQuillUI = e.target.closest(".ql-picker, .ql-tooltip");

    if (!isClickInsideEditor && !isClickInsideQuillUI) {
      closeTextEditor(true);
    }
  }
});