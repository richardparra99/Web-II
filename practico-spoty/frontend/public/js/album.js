const API_BASE = "http://localhost:3000";

const grid  = document.getElementById("albumsGrid");
const empty = document.getElementById("albumsEmpty");

// --- leer posibles filtros desde la URL ---
const params          = new URLSearchParams(location.search);
const filtroArtistaId = params.get("artistaId") || params.get("artistald"); // tolera typo
const filtroNombre    = params.get("nombre");

// Ajustar título si hay filtro
const h2 = document.querySelector("main h2");
if (h2 && filtroArtistaId) {
  h2.textContent = filtroNombre ? `Álbumes de ${filtroNombre}` : "Álbumes por artista";
}

async function loadAlbums(){
  grid.innerHTML = "";
  empty.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/albums`);
    const data = await res.json();
    let list = Array.isArray(data) ? data : [];

    // filtrar por artista si corresponde
    if (filtroArtistaId) {
      const idStr = String(filtroArtistaId);
      list = list.filter(a => {
        const byFk   = a.artistaId != null && String(a.artistaId) === idStr;
        const byJoin = a.artista && a.artista.id != null && String(a.artista.id) === idStr;
        return byFk || byJoin;
      });
    }

    renderAlbums(list);
  }catch(err){
    console.error(err);
    empty.style.display = "block";
    empty.textContent = "Error al cargar álbumes";
  }
}

function renderAlbums(list){
  if(!list.length){
    empty.style.display = "block";
    return;
  }
  grid.innerHTML = list.map(a=>{
    const img = a.imagen || `https://placehold.co/300x300?text=${encodeURIComponent(a.nombre)}`;
    const artista = a.artista ? a.artista.nombre : "Desconocido";
    return `
      <article class="card album-card" data-id="${a.id}" data-name="${escapeHtml(a.nombre)}" style="cursor:pointer">
        <img src="${img}" alt="Álbum ${escapeHtml(a.nombre)}"
             onerror="this.src='https://placehold.co/300x300?text=Album'">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(a.nombre)}</h3>
          <p style="margin:.25rem 0;color:#8b94a7;font-size:13px">${escapeHtml(artista)}</p>
        </div>
      </article>
    `;
  }).join("");

  // Click en tarjeta → ver canciones del álbum
  grid.querySelectorAll(".album-card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const id   = card.dataset.id;
      const name = card.dataset.name;
      window.location.href = `canciones.html?albumId=${id}&nombre=${encodeURIComponent(name)}`;
    });
  });
}

function escapeHtml(s=""){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

loadAlbums();
