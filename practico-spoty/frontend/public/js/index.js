// === CONFIG COMÚN ===
const API_BASE = "http://localhost:3000";

// === TU CÓDIGO EXISTENTE: GÉNEROS ===
const grid  = document.getElementById("genresGrid");
const empty = document.getElementById("genresEmpty");

// cache para el combo
let ALL_GENRES = [];

// <select id="genreSelect"> en el header (si existe)
const genreSelect = document.getElementById("genreSelect");

async function loadGenres(){
  grid.innerHTML = "";
  empty.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/generos`);
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    ALL_GENRES = list;
    renderGenres(list);
    loadGenresCombo(list);
  }catch(e){
    console.error(e);
    empty.style.display = "block";
    empty.textContent = "Error al cargar géneros";
  }
}

function renderGenres(list){
  if(!list.length){
    empty.style.display = "block";
    return;
  }
  grid.innerHTML = list.map(g=>{
    const img = g.imagen || `https://placehold.co/300x300?text=${encodeURIComponent(g.nombre)}`;
    return `
      <article class="card genre-card" data-id="${g.id}" data-name="${escapeHtml(g.nombre)}" style="cursor:pointer">
        <img src="${img}" alt="Género ${escapeHtml(g.nombre)}"
             onerror="this.src='https://placehold.co/300x300?text=Genero'">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(g.nombre)}</h3>
        </div>
      </article>
    `;
  }).join("");

  // Click en tarjeta → navegar a artistas del género
  grid.querySelectorAll(".genre-card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const id   = card.dataset.id;
      const name = card.dataset.name;
      window.location.href = `artistas.html?generoId=${id}&nombre=${encodeURIComponent(name)}`;
    });
  });
}

function escapeHtml(s=""){
  return String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// Poblar combo del header
function loadGenresCombo(list){
  if (!genreSelect) return;
  genreSelect.innerHTML = `<option value="">Géneros</option>`;
  list.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.nombre;
    genreSelect.appendChild(opt);
  });
}

// Al cambiar el combo → navegar a artistas filtrados (o todos)
if (genreSelect) {
  genreSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    const opt = genreSelect.options[genreSelect.selectedIndex];
    const name = opt ? opt.textContent : "";
    if (!val) {
      window.location.href = `artistas.html`;
    } else {
      window.location.href = `artistas.html?generoId=${val}&nombre=${encodeURIComponent(name)}`;
    }
  });
}

// === NUEVO: ARTISTAS en Home ===
const artistsGridHome = document.getElementById("artistsGridHome");
const artistsEmptyHome = document.getElementById("artistsEmptyHome");

async function loadArtistsHome(){
  artistsGridHome.innerHTML = "";
  artistsEmptyHome.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/artistas`);
    const data = await res.json();
    renderArtistsHome(Array.isArray(data) ? data : []);
  }catch(e){
    console.error(e);
    artistsEmptyHome.style.display = "block";
    artistsEmptyHome.textContent = "Error al cargar artistas";
  }
}

function renderArtistsHome(list){
  if(!list.length){
    artistsEmptyHome.style.display = "block";
    return;
  }
  artistsGridHome.innerHTML = list.map(a=>{
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

  // Click en artista → navegar a sus álbumes
  artistsGridHome.querySelectorAll(".artist-card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const id   = card.dataset.id;
      const name = card.dataset.name;
      window.location.href = `albums.html?artistaId=${id}&nombre=${encodeURIComponent(name)}`;
    });
  });
}

// === NUEVO: ÁLBUMES en Home ===
const albumsGridHome = document.getElementById("albumsGridHome");
const albumsEmptyHome = document.getElementById("albumsEmptyHome");

async function loadAlbumsHome(){
  albumsGridHome.innerHTML = "";
  albumsEmptyHome.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/albums`);
    const data = await res.json();
    renderAlbumsHome(Array.isArray(data) ? data : []);
  }catch(e){
    console.error(e);
    albumsEmptyHome.style.display = "block";
    albumsEmptyHome.textContent = "Error al cargar álbumes";
  }
}

function renderAlbumsHome(list){
  if(!list.length){
    albumsEmptyHome.style.display = "block";
    return;
  }
  albumsGridHome.innerHTML = list.map(a=>{
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

  // Click en álbum → navegar a sus canciones
  albumsGridHome.querySelectorAll(".album-card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const id   = card.dataset.id;
      const name = card.dataset.name;
      window.location.href = `canciones.html?albumId=${id}&nombre=${encodeURIComponent(name)}`;
    });
  });
}

// === NUEVO: CANCIONES en Home ===
const songsGridHome = document.getElementById("songsGridHome");
const songsEmptyHome = document.getElementById("songsEmptyHome");

async function loadSongsHome(){
  songsGridHome.innerHTML = "";
  songsEmptyHome.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/canciones`);
    const data = await res.json();
    renderSongsHome(Array.isArray(data) ? data : []);
  }catch(e){
    console.error(e);
    songsEmptyHome.style.display = "block";
    songsEmptyHome.textContent = "Error al cargar canciones";
  }
}

function renderSongsHome(list){
  if(!list.length){
    songsEmptyHome.style.display = "block";
    return;
  }
  songsGridHome.innerHTML = list.map(c=>{
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
        </div>
      </article>
    `;
  }).join("");
}

// === ARRANQUE ===
loadGenres();
loadArtistsHome();
loadAlbumsHome();
loadSongsHome();
