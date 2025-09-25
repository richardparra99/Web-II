const API_BASE = "http://localhost:3000";

const grid  = document.getElementById("artistsGrid");
const empty = document.getElementById("artistsEmpty");

// Leer query params para filtrar por género
const params = new URLSearchParams(location.search);
const filtroGeneroId = params.get("generoId");
const filtroNombre   = params.get("nombre");

// Ajustar título si hay filtro
const h2 = document.querySelector("main h2");
if (h2 && filtroGeneroId) {
  h2.textContent = filtroNombre ? `Artistas de ${filtroNombre}` : "Artistas por género";
}

async function loadArtistas(){
  grid.innerHTML = "";
  empty.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/artistas`);
    if(!res.ok) throw new Error("Error al cargar artistas");
    let data = await res.json();

    // Filtrar por género si corresponde
    if (filtroGeneroId) {
      data = (Array.isArray(data) ? data : []).filter(a =>
        (a.generos || []).some(g => String(g.id) === String(filtroGeneroId))
      );
    }

    renderArtists(Array.isArray(data) ? data : []);
  }catch(err){
    console.error(err);
    empty.style.display = "block";
    empty.textContent = "Error al cargar artistas";
  }
}

function renderArtists(list){
  if(!list.length){
    empty.style.display = "block";
    return;
  }
  grid.innerHTML = list.map(a=>{
    const img = a.imagen || `https://placehold.co/300x300?text=${encodeURIComponent(a.nombre)}`;
    const gens = (a.generos || []).map(g => g.nombre).join(", ") || "Sin géneros";
    return `
      <article class="card artist-card" data-id="${a.id}" data-name="${escapeHtml(a.nombre)}" style="cursor:pointer">
        <img src="${img}" alt="Artista ${escapeHtml(a.nombre)}"
             onerror="this.src='https://placehold.co/300x300?text=Artista'">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(a.nombre)}</h3>
          <p style="margin:.25rem 0;color:#8b94a7;font-size:13px">${escapeHtml(gens)}</p>
        </div>
      </article>
    `;
  }).join("");

  // Click en la tarjeta → navegar a álbumes del artista
  grid.querySelectorAll(".artist-card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const id   = card.getAttribute("data-id");
      const name = card.getAttribute("data-name");
      window.location.href = `albums.html?artistaId=${id}&nombre=${encodeURIComponent(name)}`;
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

loadArtistas();
