const API_BASE = "http://localhost:3000";

const form = document.getElementById("frmAlbum");
const fileInput = document.getElementById("imagen");
const previewBox = document.getElementById("previewBox");
const previewImg = document.getElementById("previewImg");
const artistaSelect = document.getElementById("artistaId");

const params = new URLSearchParams(location.search);
const editId = params.get("id");

// Preview
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) {
    previewBox.style.display = "none";
    previewImg.removeAttribute("src");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewBox.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// Cargar artistas
async function loadArtistas() {
  const res = await fetch(`${API_BASE}/artistas`);
  const data = await res.json();
  artistaSelect.innerHTML = `<option value="">Selecciona un artista</option>`;
  (Array.isArray(data) ? data : []).forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.nombre;
    artistaSelect.appendChild(opt);
  });
}

// Cargar álbum si es edición
async function loadAlbum(id){
  const res = await fetch(`${API_BASE}/albums/${id}`);
  if(!res.ok) return;
  const alb = await res.json();
  form.nombre.value = alb.nombre || "";
  if (alb.artistaId) artistaSelect.value = String(alb.artistaId);
  if (alb.imagen) {
    previewImg.src = alb.imagen;
    previewBox.style.display = "block";
  } else {
    previewBox.style.display = "none";
  }
}

// Init
(async () => {
  await loadArtistas();
  if (editId) await loadAlbum(editId);
})();

// Enviar
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form); // nombre, artistaId, imagen (si hay)
  if (!fileInput.files.length) {
    formData.delete("imagen"); // no cambiar imagen si no seleccionas nueva
  }

  try{
    const url    = editId ? `${API_BASE}/albums/${editId}` : `${API_BASE}/albums`;
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      window.location.href = "./albums.html";
    }
  }catch(err){
    console.error(err);
  }
});
