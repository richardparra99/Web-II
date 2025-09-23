const API_BASE = "http://localhost:3000";

const grid  = document.getElementById("songsGrid");
const empty = document.getElementById("songsEmpty");

// Leer query params para filtrar por álbum
const params       = new URLSearchParams(location.search);
const filtroAlbumId = params.get("albumId");
const filtroNombre  = params.get("nombre");

// Ajustar título si hay filtro
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

    // Filtrar por álbum si corresponde
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
    const album    = c.album ? c.album.nombre : "Sin álbum";
    const artista  = c.album && c.album.artista ? c.album.artista.nombre : "Desconocido";
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
            </audio>` : `<p style="color:#888">Sin archivo MP3</p>`}
          <div style="margin-top:8px; display:flex; gap:6px;">
            <button class="btn-edit" data-id="${c.id}">Editar</button>
            <button class="btn-del"  data-id="${c.id}">Eliminar</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Editar
  grid.querySelectorAll(".btn-edit").forEach(btn=>{
    btn.addEventListener("click", (ev)=>{
      ev.stopPropagation();
      const id = btn.getAttribute("data-id");
      window.location.href = `formCancion.html?id=${id}`;
    });
  });

  // Eliminar
  grid.querySelectorAll(".btn-del").forEach(btn=>{
    btn.addEventListener("click", async (ev)=>{
      ev.stopPropagation();
      const id = btn.getAttribute("data-id");
      if (!confirm("¿Seguro que deseas eliminar esta canción?")) return;
      try{
        const res = await fetch(`${API_BASE}/canciones/${id}`, { method: "DELETE" });
        if(!res.ok) throw new Error("No se pudo eliminar");
        loadCanciones();
      }catch(err){
        console.error(err);
        alert("No se pudo eliminar la canción");
      }
    });
  });
}

function escapeHtml(s=""){
  return String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

loadCanciones();
