const API_BASE = "http://localhost:3000";

const form = document.getElementById("frmArtista");
const fileInput = document.getElementById("imagen");
const previewBox = document.getElementById("previewBox");
const previewImg = document.getElementById("previewImg");
const generoSelect = document.getElementById("generoId");

// ===== util: obtener query param id =====
const params = new URLSearchParams(location.search);
const editId = params.get("id"); // null si es creación

// ===== preview de archivo =====
if (fileInput && previewBox && previewImg) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) {
      previewBox.style.display = "none";
      previewImg.removeAttribute("src");
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    previewImg.onerror = () => { previewImg.src = "https://placehold.co/300x300?text=Artista"; };
    previewImg.src = blobUrl;
    previewBox.style.display = "block";
  });
}

// ===== cargar géneros =====
async function loadGeneros(selectedId){
  if (!generoSelect) return;
  try{
    const res = await fetch(`${API_BASE}/generos`);
    const data = await res.json();
    generoSelect.innerHTML = `<option value="">Selecciona un género</option>`;
    (Array.isArray(data) ? data : []).forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.nombre;
      generoSelect.appendChild(opt);
    });
    if (selectedId) generoSelect.value = String(selectedId);
  }catch(e){
    console.error("No se pudieron cargar géneros", e);
  }
}

// ===== si es edición, pre-cargar artista =====
async function loadArtistIfEdit(){
  if (!editId) {          // creación
    await loadGeneros();  // sin selección previa
    return;
  }
  try{
    const res = await fetch(`${API_BASE}/artistas/${editId}`);
    if(!res.ok) throw new Error("No se pudo cargar el artista");
    const a = await res.json();

    // nombre
    form.nombre.value = a.nombre || "";

    // imagen actual (si hay)
    if (a.imagen) {
      previewImg.src = a.imagen;
      previewBox.style.display = "block";
    } else {
      previewBox.style.display = "none";
    }

    // seleccionar su primer género (si tu app maneja solo uno aquí)
    const currentGenreId = (a.generos && a.generos[0]) ? a.generos[0].id : "";
    await loadGeneros(currentGenreId);
  }catch(err){
    console.error(err);
    await loadGeneros(); // fallback
  }
}
loadArtistIfEdit();

// ===== submit: crear o editar =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // FormData para nombre + archivo (si hay)
  const fd = new FormData();
  fd.append("nombre", form.nombre.value.trim() || "");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    fd.append("imagen", fileInput.files[0]); // multer: upload.single("imagen")
  }

  try{
    let artista;
    if (!editId) {
      // CREAR
      const res = await fetch(`${API_BASE}/artistas`, { method: "POST", body: fd });
      if(!res.ok) return;
      artista = await res.json();
    } else {
      // EDITAR (PATCH con multer)
      const res = await fetch(`${API_BASE}/artistas/${editId}`, { method: "PATCH", body: fd });
      if(!res.ok) return;
      artista = await res.json();
    }

    // asignar/actualizar género si se seleccionó uno
    if (generoSelect && generoSelect.value) {
      const generoId = Number(generoSelect.value);
      await fetch(`${API_BASE}/artistas/${artista.id}/generos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generos: [generoId] })
      });
    }

    // volver al listado
    window.location.href = "./artistas.html";
  }catch(err){
    console.error(err);
  }
});
