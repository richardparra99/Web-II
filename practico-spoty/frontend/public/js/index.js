// === TU CÓDIGO ORIGINAL ===
const API_BASE = "http://localhost:3000";
const grid  = document.getElementById("genresGrid");
const empty = document.getElementById("genresEmpty");

async function loadGenres(){
  grid.innerHTML = "";
  empty.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/generos`);
    const data = await res.json();
    renderGenres(Array.isArray(data) ? data : []);
    
    // === NUEVO: guardar y poblar combo ===
    ALL_GENRES = Array.isArray(data) ? data : [];
    loadGenresCombo(ALL_GENRES);
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
      <article class="card">
        <img src="${img}" alt="Género ${escapeHtml(g.nombre)}"
             onerror="this.src='https://placehold.co/300x300?text=Genero'">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(g.nombre)}</h3>
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

loadGenres();


// === CÓDIGO NUEVO (combobox) ===

// cache en memoria para filtrar desde el combo
let ALL_GENRES = [];

// referencia al <select id="genreSelect"> del header
const genreSelect = document.getElementById("genreSelect");

// pobla el combo con la lista recibida
function loadGenresCombo(list){
  if (!genreSelect) return; // por si el select no existe en el HTML
  genreSelect.innerHTML = `<option value="">Géneros</option>`;
  list.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.nombre;
    genreSelect.appendChild(opt);
  });
}

// al cambiar el combo: filtra la grilla (vacío = todos)
if (genreSelect) {
  genreSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (!val) {
      renderGenres(ALL_GENRES);
      return;
    }
    const filtered = ALL_GENRES.filter(g => String(g.id) === String(val));
    renderGenres(filtered);
  });
}
