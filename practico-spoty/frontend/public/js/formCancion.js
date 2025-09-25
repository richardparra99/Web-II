const API_BASE = "http://localhost:3000";

const form         = document.getElementById("frmCancion");
const fileInput    = document.getElementById("archivo");
const previewBox   = document.getElementById("previewBox");
const previewAudio = document.getElementById("previewAudio");
const albumSelect  = document.getElementById("albumId");

// === Modo edición si hay ?id= ===
const params   = new URLSearchParams(location.search);
const editId   = params.get("id");

// === Preview de audio (sin textos extra) ===
let lastObjectUrl = null;

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  previewBox.style.display = "none";
  previewAudio.removeAttribute("src");

  if (lastObjectUrl) {
    URL.revokeObjectURL(lastObjectUrl);
    lastObjectUrl = null;
  }
  if (!file) return;

  const url = URL.createObjectURL(file);
  lastObjectUrl = url;
  previewAudio.src = url;
  previewAudio.load();
  const showWhenReady = () => {
    previewBox.style.display = "block";
    previewAudio.removeEventListener("loadedmetadata", showWhenReady);
  };
  previewAudio.addEventListener("loadedmetadata", showWhenReady);
});

// === Cargar álbumes al combo ===
async function loadAlbums() {
  const res = await fetch(`${API_BASE}/albums`);
  const data = await res.json();
  albumSelect.innerHTML = `<option value="">Selecciona un álbum</option>`;
  (Array.isArray(data) ? data : []).forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.nombre;
    albumSelect.appendChild(opt);
  });
}

// === Cargar datos si es edición ===
async function loadForEdit(id) {
  const res = await fetch(`${API_BASE}/canciones/${id}`);
  if (!res.ok) return;
  const c = await res.json();

  // nombre
  form.nombre.value = c.nombre || "";

  // álbum (espera a que el combo esté cargado)
  if (c.albumId) {
    albumSelect.value = String(c.albumId);
  } else if (c.album && c.album.id) {
    albumSelect.value = String(c.album.id);
  }

  // preview del audio actual (si hay)
  if (c.archivo) {
    previewAudio.src = c.archivo;
    previewAudio.load();
    const show = () => {
      previewBox.style.display = "block";
      previewAudio.removeEventListener("loadedmetadata", show);
    };
    previewAudio.addEventListener("loadedmetadata", show);
  }
}

// Init: carga combos y (si aplica) datos
(async () => {
  await loadAlbums();
  if (editId) {
    await loadForEdit(editId);
  }
})();

// === Enviar formulario (POST o PUT según modo) ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form); // incluye nombre, albumId y archivo si se eligió

  const url    = editId ? `${API_BASE}/canciones/${editId}` : `${API_BASE}/canciones`;
  const method = editId ? "PUT" : "POST";

  try {
    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      window.location.href = "./canciones.html";
    }
  } catch (err) {
    console.error(err);
  }
});