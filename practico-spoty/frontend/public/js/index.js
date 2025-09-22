const API_BASE = "http://localhost:3000";
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
          <div style="margin-top:8px; display:flex; gap:6px;">
            <button class="btn-edit-genero" data-id="${g.id}">Editar</button>
            <button class="btn-del-genero" data-id="${g.id}">Eliminar</button>
          </div>
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

  // Botón Editar
  grid.querySelectorAll(".btn-edit-genero").forEach(btn=>{
    btn.addEventListener("click", (ev)=>{
      ev.stopPropagation();
      const id = btn.getAttribute("data-id");
      window.location.href = `formGenero.html?id=${id}`;
    });
  });

  // Botón Eliminar
  grid.querySelectorAll(".btn-del-genero").forEach(btn=>{
    btn.addEventListener("click", async (ev)=>{
      ev.stopPropagation();
      const id = btn.getAttribute("data-id");
      if (!confirm("¿Seguro que deseas eliminar este género?")) return;
      try{
        const res = await fetch(`${API_BASE}/generos/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");
        // recargar lista
        loadGenres();
      }catch(err){
        console.error(err);
        alert("No se pudo eliminar el género");
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

loadGenres();
