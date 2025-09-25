const API_BASE = "http://localhost:3000";

const grid  = document.getElementById("genresGrid");
const empty = document.getElementById("genresEmpty");

async function loadGeneros(){
  grid.innerHTML = "";
  empty.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/generos`);
    const data = await res.json();
    renderGeneros(Array.isArray(data) ? data : []);
  }catch(err){
    console.error(err);
    empty.style.display = "block";
    empty.textContent = "Error al cargar géneros";
  }
}

function renderGeneros(list){
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

  // Click en tarjeta → ir a sus artistas
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

loadGeneros();
