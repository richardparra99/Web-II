const API_BASE = "http://localhost:3000";

// === Formulario ===
const form = document.getElementById("frmGenero");
const fileInput = form.querySelector('input[name="imagen"]');

// (Opcional) contenedores de previsualización si existen en el HTML
const previewBox = document.getElementById("previewBox");
const previewImg = document.getElementById("previewImg");

// detectar si es edición
const params = new URLSearchParams(location.search);
const editId = params.get("id"); // null si es creación

// ==== vista previa desde archivo ====
if (fileInput && previewBox && previewImg) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) {
      previewBox.style.display = "none";
      previewImg.removeAttribute("src");
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    previewImg.onerror = () => {
      previewImg.src = "https://placehold.co/300x300?text=Imagen";
    };
    previewImg.src = blobUrl;
    previewBox.style.display = "block";
  });
}

// ==== si es edición, precargar datos ====
async function loadGeneroIfEdit(){
  if (!editId) return;
  try{
    const res = await fetch(`${API_BASE}/generos/${editId}`);
    if(!res.ok) throw new Error("No se pudo cargar el género");
    const g = await res.json();

    // prefill
    form.nombre.value = g.nombre || "";

    // vista previa de imagen actual (si hay contenedor y hay ruta)
    if (previewBox && previewImg && g.imagen) {
      previewImg.src = g.imagen;
      previewBox.style.display = "block";
    }
  }catch(err){
    console.error(err);
  }
}
loadGeneroIfEdit();

// ==== enviar (crear/editar) ====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fd = new FormData();
  fd.append("nombre", form.nombre.value.trim() || "");

  if (fileInput && fileInput.files && fileInput.files[0]) {
    fd.append("imagen", fileInput.files[0]); // multer: upload.single("imagen")
  }

  try {
    let res;
    if (!editId) {
      // crear
      res = await fetch(`${API_BASE}/generos`, {
        method: "POST",
        body: fd
      });
    } else {
      // editar (PATCH)
      res = await fetch(`${API_BASE}/generos/${editId}`, {
        method: "PATCH",
        body: fd
      });
    }
    if (!res.ok) {
      console.error("Error al guardar género");
      return;
    }
    // volver al listado
    window.location.href = "./index.html";
  } catch (err) {
    console.error(err);
  }
});
