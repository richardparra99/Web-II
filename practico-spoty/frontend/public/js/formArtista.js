const API_BASE = "http://localhost:3000"; // ajusta si usas otro puerto

const form = document.getElementById("frmArtista");
const urlInput = document.getElementById("imagen");
const previewBox = document.getElementById("previewBox");
const previewImg = document.getElementById("previewImg");

// === Nuevo: referencia al select de géneros ===
const generoSelect = document.getElementById("generoId");

// Normaliza si falta https://
function normalizeUrl(v){
  let u = String(v || "").trim();
  if(!u) return "";
  if(!/^https?:\/\//i.test(u)) u = "https://" + u;
  return u;
}

function updatePreview(){
  const url = normalizeUrl(urlInput.value);
  if(!url){
    previewBox.style.display = "none";
    previewImg.removeAttribute("src");
    return;
  }
  previewImg.onerror = () => { previewImg.src = "https://placehold.co/300x300?text=Artista"; };
  previewImg.src = url;
  previewBox.style.display = "block";
}
urlInput.addEventListener("input", updatePreview);

// === Nuevo: cargar géneros desde la API ===
async function loadGeneros(){
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
  }catch(e){
    console.error("No se pudieron cargar géneros", e);
  }
}
loadGeneros();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    nombre: form.nombre.value.trim(),
    imagen: normalizeUrl(urlInput.value) || undefined
  };

  try{
    // 1) Crear artista
    const res = await fetch(`${API_BASE}/artistas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if(!res.ok){
      // si falla validación del backend (Joi), permanece en el form
      return;
    }
    const artista = await res.json();

    // 2) Asignar género si se seleccionó uno
    if (generoSelect && generoSelect.value) {
      const generoId = Number(generoSelect.value);
      await fetch(`${API_BASE}/artistas/${artista.id}/generos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generos: [generoId] })
      });
    }

    // 3) Redirige al listado
    window.location.href = "./artistas.html";
  }catch(err){
    console.error(err);
  }
});
