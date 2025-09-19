const API_BASE = "http://localhost:3000"; // mismo host/puerto

// === Formulario ===
const form = document.getElementById("frmGenero");
const urlInput = document.getElementById("imagen");
const previewBox = document.getElementById("previewBox");
const previewImg = document.getElementById("previewImg");

// Normaliza si falta https://
function normalizeUrl(v) {
  let u = String(v || "").trim();
  if (!u) return "";
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  return u;
}

// Actualiza vista previa mientras escribes
function updatePreview() {
  const url = normalizeUrl(urlInput.value);
  if (!url) {
    previewBox.style.display = "none";
    previewImg.removeAttribute("src");
    return;
  }
  previewImg.onerror = () => {
    previewImg.src = "https://placehold.co/300x300?text=Imagen";
  };
  previewImg.src = url;
  previewBox.style.display = "block";
}
urlInput.addEventListener("input", updatePreview);

// Enviar formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    nombre: form.nombre.value.trim(),
    imagen: normalizeUrl(urlInput.value) || undefined,
  };
  try {
    await fetch(`${API_BASE}/generos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // Ir directo al listado
    window.location.href = "./index.html";
  } catch (err) {
    console.error(err);
  }
});
