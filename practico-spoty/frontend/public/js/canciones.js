// public/js/canciones.js
const API_BASE = "http://localhost:3000";

const grid  = document.getElementById("songsGrid");
const empty = document.getElementById("songsEmpty");

const params        = new URLSearchParams(location.search);
const filtroAlbumId = params.get("albumId");
const filtroNombre  = params.get("nombre");

const h2 = document.querySelector("main h2");
if (h2 && filtroAlbumId) {
  h2.textContent = filtroNombre ? `Canciones de ${filtroNombre}` : "Canciones por álbum";
}

async function loadCanciones(){
  grid.innerHTML = "";
  empty.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/canciones`);
    if(!res.ok) throw new Error("Error al cargar canciones");
    let data = await res.json();

    if (filtroAlbumId) {
      data = (Array.isArray(data) ? data : []).filter(c =>
        String(c.albumId ?? (c.album && c.album.id)) === String(filtroAlbumId)
      );
    }

    renderCanciones(Array.isArray(data) ? data : []);
  }catch(err){
    console.error(err);
    empty.style.display = "block";
    empty.textContent = "Error al cargar canciones";
  }
}

function renderCanciones(list){
  if(!list.length){
    empty.style.display = "block";
    return;
  }
  grid.innerHTML = list.map(c=>{
    const audioSrc = c.archivo || "";
    const album   = c.album ? c.album.nombre : "Sencillo";
    const artista = c.album && c.album.artista ? c.album.artista.nombre : "—";

    return `
      <article class="card">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(c.nombre)}</h3>
          <p style="margin:.25rem 0;color:#8b94a7;font-size:13px">
            ${escapeHtml(artista)} - ${escapeHtml(album)}
          </p>
          ${audioSrc ? `
            <audio controls style="width:100%; margin-top:8px;">
              <source src="${audioSrc}" type="audio/mpeg">
              Tu navegador no soporta la reproducción de audio.
            </audio>` : `<p style="color:#888">Sin archivo MP3</p>`}
        </div>
      </article>
    `;
  }).join("");
}

function escapeHtml(s=""){
  return String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

loadCanciones();
