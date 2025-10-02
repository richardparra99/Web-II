const API_BASE = "http://localhost:3000";

const form       = document.getElementById("frmArtista");
const fileInput  = document.getElementById("imagen");
const previewBox = document.getElementById("previewBox");
const previewImg = document.getElementById("previewImg");
const generosBox = document.getElementById("generosBox");

const params = new URLSearchParams(location.search);
const editId = params.get("id");

// ===== preview de imagen =====
if (fileInput && previewBox && previewImg) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) {
      previewBox.style.display = "none";
      previewImg.removeAttribute("src");
      return;
    }
    const url = URL.createObjectURL(file);
    previewImg.onerror = () => { previewImg.src = "https://placehold.co/300x300?text=Artista"; };
    previewImg.src = url;
    previewBox.style.display = "block";
  });
}

function renderGenerosCheckboxes(list = [], selectedIds = []) {
  if (!generosBox) return;
  const selSet = new Set((selectedIds || []).map(String));
  generosBox.innerHTML = (list || []).map(g => {
    const checked = selSet.has(String(g.id)) ? "checked" : "";
    const safe = String(g.nombre || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;");
    return `
      <label class="checkbox-item">
        <input type="checkbox" name="generos" value="${g.id}" ${checked}/>
        <span>${safe}</span>
      </label>
    `;
  }).join("");
}

async function fetchGeneros() {
  const res = await fetch(`${API_BASE}/generos`);
  return await res.json();
}

async function initForm() {
  try {
    const generos = Array.isArray(await fetchGeneros()) ? await fetchGeneros() : [];
    if (!editId) {
      renderGenerosCheckboxes(generos, []);
      return;
    }
    const res = await fetch(`${API_BASE}/artistas/${editId}`);
    if (!res.ok) throw new Error("No se pudo cargar el artista");
    const a = await res.json();

    // nombre
    form.nombre.value = a.nombre || "";

    // imagen actual
    if (a.imagen) {
      previewImg.src = a.imagen;
      previewBox.style.display = "block";
    } else {
      previewBox.style.display = "none";
    }

    // marcar géneros del artista
    const idsSeleccionados = (a.generos || []).map(g => g.id);
    renderGenerosCheckboxes(generos, idsSeleccionados);
  } catch (e) {
    // fallback: al menos mostramos los géneros
    try {
      const gens = await fetchGeneros();
      renderGenerosCheckboxes(Array.isArray(gens) ? gens : [], []);
    } catch {}
  }
}
initForm();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const checked = Array.from(form.querySelectorAll('input[name="generos"]:checked'))
                       .map(ch => Number(ch.value))
                       .filter(n => Number.isFinite(n));

  const fd = new FormData();
  fd.append("nombre", form.nombre.value.trim() || "");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    fd.append("imagen", fileInput.files[0]);
  }

  try {
    let artista;
    if (!editId) {
      const res = await fetch(`${API_BASE}/artistas`, { method: "POST", body: fd });
      if (!res.ok) return;
      artista = await res.json();
    } else {
      const res = await fetch(`${API_BASE}/artistas/${editId}`, { method: "PATCH", body: fd });
      if (!res.ok) return;
      artista = await res.json();
    }

    // asignar/actualizar géneros si hay selección
    if (checked.length) {
      await fetch(`${API_BASE}/artistas/${artista.id}/generos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generos: checked })
      });
    }

    window.location.href = "./artistas.html";
  } catch (err) {
    console.error(err);
  }
});
