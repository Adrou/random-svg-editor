// app.js

// --- Utilidades de idioma ---
const LANGS = {
  es: {
    "random svg editor": "random svg editor",
    "Código SVG": "Código SVG",
    "Vista previa": "Vista previa",
    "Personalizado": "Personalizado",
    "Random": "Random",
    "Copiar": "Copiar",
    "Limpiar": "Limpiar",
    "Rectángulo": "Rectángulo",
    "Círculo": "Círculo",
    "Elipse": "Elipse",
    "Línea": "Línea",
    "Polígono": "Polígono",
    "Estrella": "Estrella",
    "Corazón": "Corazón",
    "Check": "Check",
    "Sol": "Sol",
    "Luna": "Luna",
    "Usuario": "Usuario",
    "Mensaje": "Mensaje",
    "¡Copiado!": "¡Copiado!",
    "Copiado": "Copiado"
  },
  en: {
    "random svg editor": "random svg editor",
    "Código SVG": "SVG Code",
    "Vista previa": "Preview",
    "Personalizado": "Custom",
    "Random": "Random",
    "Copiar": "Copy",
    "Limpiar": "Clear",
    "Rectángulo": "Rectangle",
    "Círculo": "Circle",
    "Elipse": "Ellipse",
    "Línea": "Line",
    "Polígono": "Polygon",
    "Estrella": "Star",
    "Corazón": "Heart",
    "Check": "Check",
    "Sol": "Sun",
    "Luna": "Moon",
    "Usuario": "User",
    "Mensaje": "Message",
    "¡Copiado!": "Copied!",
    "Copiado": "Copied"
  }
};
let currentLang = "es";
function t(key) {
  return LANGS[currentLang][key] || key;
}

// --- Modo claro/oscuro ---
const themeBtn = document.getElementById("theme-btn");
const themeIcon = document.getElementById("theme-icon");
function setTheme(dark) {
  document.documentElement.classList.toggle("dark", dark);
  themeIcon.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("theme", dark ? "dark" : "light");
}
themeBtn.onclick = () => setTheme(!document.documentElement.classList.contains("dark"));
(function initTheme() {
  const saved = localStorage.getItem("theme");
  setTheme(saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches));
})();

// --- Internacionalización ---
const langBtn = document.getElementById("lang-btn");
langBtn.onclick = () => {
  currentLang = currentLang === "es" ? "en" : "es";
  localStorage.setItem("lang", currentLang);
  updateLang();
};
function updateLang() {
  document.title = t("random svg editor");
  document.querySelector("h1").textContent = t("random svg editor");
  document.getElementById("editor-label").textContent = t("Código SVG");
  document.getElementById("preview-label").textContent = t("Vista previa");
  document.getElementById("custom-color-label").textContent = t("Personalizado");
  document.getElementById("random-label").textContent = t("Random");
  document.getElementById("copy-label").textContent = t("Copiar");
  document.getElementById("clear-label").textContent = t("Limpiar");
  document.querySelectorAll("#basic-shapes .shape-btn").forEach((btn, i) => {
    btn.title = t(BASIC_SHAPES[i].name);
  });
  document.querySelectorAll("#svg-icons .icon-btn").forEach((btn, i) => {
    btn.title = t(SVG_ICONS[i].name);
  });
}
(function initLang() {
  const saved = localStorage.getItem("lang");
  if (saved && (saved === "es" || saved === "en")) currentLang = saved;
  updateLang();
})();

// --- Figuras básicas e iconos ---
const basicShapesDiv = document.getElementById("basic-shapes");
const svgIconsDiv = document.getElementById("svg-icons");
function renderShapes() {
  basicShapesDiv.innerHTML = "";
  BASIC_SHAPES.forEach((shape, i) => {
    const btn = document.createElement("button");
    btn.className = "shape-btn";
    btn.innerHTML = shape.svg;
    btn.title = t(shape.name);
    btn.onclick = () => {
      selectShape(i);
      setCode(shape.code);
    };
    basicShapesDiv.appendChild(btn);
  });
}
function renderIcons() {
  svgIconsDiv.innerHTML = "";
  SVG_ICONS.forEach((icon, i) => {
    const btn = document.createElement("button");
    btn.className = "icon-btn";
    btn.innerHTML = icon.svg;
    btn.title = t(icon.name);
    btn.onclick = () => {
      selectIcon(i);
      setCode(icon.code);
    };
    svgIconsDiv.appendChild(btn);
  });
}
function selectShape(idx) {
  document.querySelectorAll("#basic-shapes .shape-btn").forEach((btn, i) => {
    btn.classList.toggle("selected", i === idx);
  });
  document.querySelectorAll("#svg-icons .icon-btn").forEach(btn => btn.classList.remove("selected"));
}
function selectIcon(idx) {
  document.querySelectorAll("#svg-icons .icon-btn").forEach((btn, i) => {
    btn.classList.toggle("selected", i === idx);
  });
  document.querySelectorAll("#basic-shapes .shape-btn").forEach(btn => btn.classList.remove("selected"));
}
renderShapes();
renderIcons();

// --- Paleta de colores ---
const PALETTE = [
  "#6366f1", "#f59e42", "#10b981", "#ef4444", "#f472b6", "#fbbf24", "#ef476f", "#22c55e", "#38bdf8", "#bae6fd",
  "#000000", "#22223b", "#4a4e69", "#9a8c98", "#c9ada7", "#f2e9e4", "#ffffff", "#e0e7ef", "#23272f", "#1a1d23",
  "#ff6f61", "#6b5b95", "#feb236", "#d64161", "#ff7b25", "#00b8a9", "#f6416c", "#43e97b", "#38f9d7", "#fa8bff"
];
const colorPaletteDiv = document.getElementById("color-palette");
const customHex = document.getElementById("custom-hex");
function renderPalette() {
  colorPaletteDiv.innerHTML = "";
  PALETTE.forEach(hex => {
    const swatch = document.createElement("span");
    swatch.className = "color-swatch";
    swatch.style.background = hex;
    swatch.title = hex;
    swatch.onclick = () => {
      showCopied(hex);
      copyToClipboard(hex);
    };
    colorPaletteDiv.appendChild(swatch);
  });
}
renderPalette();

// --- Color personalizado ---
const customColorBtn = document.getElementById("custom-color-btn");
const colorPicker = document.getElementById("color-picker");
customColorBtn.onclick = () => colorPicker.click();
colorPicker.oninput = e => {
  showCopied(e.target.value);
};
customHex.onclick = () => {
  if (customHex.textContent) {
    copyToClipboard(customHex.textContent);
    showCopied(customHex.textContent);
  }
};
function showCopied(hex) {
  customHex.textContent = hex;
  customHex.style.background = hex;
  customHex.style.color = getContrastYIQ(hex);
  customHex.classList.add("pop");
  customHex.setAttribute("title", t("Copiado"));
  let msg = document.createElement("span");
  msg.textContent = t("¡Copiado!");
  msg.className = "ml-2 text-xs font-semibold text-green-600 dark:text-green-400 animate-pulse";
  customHex.parentNode.appendChild(msg);
  setTimeout(() => {
    customHex.classList.remove("pop");
    msg.remove();
  }, 900);
}
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0,2),16);
  const g = parseInt(hexcolor.substr(2,2),16);
  const b = parseInt(hexcolor.substr(4,2),16);
  return ((r*299)+(g*587)+(b*114))/1000 >= 128 ? "#222" : "#fff";
}


// --- Editor y vista previa SVG ---
const svgCode = document.getElementById("svg-code");
const svgPreview = document.getElementById("svg-preview");

svgCode.addEventListener("input", updatePreview);
function setCode(code) {
  svgCode.value = code;
  updatePreview();
}
function updatePreview() {
  let code = svgCode.value.trim();
  svgPreview.innerHTML = "";
  if (!code) return;
  try {
    svgPreview.innerHTML = code;
    let svg = svgPreview.querySelector("svg");
    if (svg) svg.setAttribute("style", "max-width:100%;max-height:100%;display:block;margin:auto;");
  } catch (e) {
    svgPreview.innerHTML = `<div class="text-xs text-red-500 p-2">${e.message}</div>`;
  }
}

// --- Importar SVG ---
const importSvg = document.getElementById("import-svg");
importSvg.onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    setCode(evt.target.result);
  };
  reader.readAsText(file);
  importSvg.value = "";
};

// --- Exportar SVG y PNG ---
document.getElementById("download-svg").onclick = () => {
  let code = svgCode.value.trim();
  if (!code) return;
  // Forzar xmlns si no existe
  if (!/xmlns=/.test(code)) {
    code = code.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  // Forzar encabezado XML y DOCTYPE si no existen
  if (!code.startsWith('<?xml')) {
    code = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n` + code;
  }
  if (!/<svg[\s>]/.test(code)) {
    alert("No es un SVG válido.");
    return;
  }
  const blob = new Blob([code], {type: "image/svg+xml"});
  const url = URL.createObjectURL(blob);
  downloadURL(url, "graphic.svg");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
document.getElementById("download-png").onclick = () => {
  let code = svgCode.value.trim();
  if (!code) return;
  if (!/xmlns=/.test(code)) {
    code = code.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!/<svg[\s>]/.test(code)) {
    alert("No es un SVG válido.");
    return;
  }
  const svg = new Blob([code], {type: "image/svg+xml"});
  const url = URL.createObjectURL(svg);
  const img = new window.Image();
  img.onload = function() {
    let w = img.width || 512, h = img.height || 512;
    try {
      const match = code.match(/<svg[^>]*width="(\d+)"[^>]*height="(\d+)"/);
      if (match) { w = parseInt(match[1]); h = parseInt(match[2]); }
    } catch {}
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob(blob => {
      downloadURL(URL.createObjectURL(blob), "graphic.png");
    }, "image/png");
    URL.revokeObjectURL(url);
  };
  img.onerror = () => alert("SVG inválido");
  img.src = url;
};
function downloadURL(url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// --- Botones inferiores ---
document.getElementById("random-btn").onclick = () => {
  const all = [...BASIC_SHAPES, ...SVG_ICONS];
  const idx = Math.floor(Math.random() * all.length);
  setCode(all[idx].code);
  document.querySelectorAll(".shape-btn, .icon-btn").forEach(btn => btn.classList.remove("selected"));
};
document.getElementById("copy-btn").onclick = () => {
  copyToClipboard(svgCode.value);
  showCopied("SVG");
};
document.getElementById("clear-btn").onclick = () => {
  svgCode.value = "";
  colorizeCode();
  updatePreview();
  document.querySelectorAll(".shape-btn, .icon-btn").forEach(btn => btn.classList.remove("selected"));
};

// --- Copiar al portapapeles ---
function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard.writeText(text);
}

// --- Inicialización: SVG por defecto ---
setCode(BASIC_SHAPES[0].code);

// --- Colorización del editor de código (overlay visual, nunca interfiere con edición) ---
function colorizeCode() {
  let code = svgCode.value;
  if (!code) {
    codeOverlay.style.display = "none";
    svgCode.style.color = "";
    svgCode.style.background = "";
    return;
  }
  // Coloriza sólo en el overlay, nunca en el textarea
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Colorea los valores hex
    .replace(/(#(?:[0-9a-fA-F]{3,8}))/g, `<span style="color:#6366f1;font-weight:bold">$1</span>`)
    // Colorea width/height con comillas
    .replace(/(width|height)=("?\d+"?)/g, (m, p1, p2) =>
      `<span style="color:#6366f1">${p1}=</span><span style="color:#6366f1;font-weight:bold">${p2}</span>`
    );
  codeOverlay.innerHTML = html;
  codeOverlay.style.display = "block";
  codeOverlay.scrollTop = svgCode.scrollTop;
  codeOverlay.scrollLeft = svgCode.scrollLeft;
  
  // Asegura que el overlay y el textarea estén perfectamente alineados
  codeOverlay.style.padding = window.getComputedStyle(svgCode).padding;
  codeOverlay.style.fontSize = window.getComputedStyle(svgCode).fontSize;
  codeOverlay.style.lineHeight = window.getComputedStyle(svgCode).lineHeight;
  codeOverlay.style.fontFamily = window.getComputedStyle(svgCode).fontFamily;
  codeOverlay.style.height = svgCode.offsetHeight + "px";
  codeOverlay.style.width = svgCode.offsetWidth + "px";
  svgCode.style.color = "transparent";
  svgCode.style.background = "transparent";
  svgCode.style.caretColor = "#6366f1";
}
window.addEventListener("resize", colorizeCode);
setTimeout(colorizeCode, 100);

// --- Mejoras visuales automáticas ---
updatePreview();
colorizeCode();