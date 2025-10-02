const API_BASE = "http://localhost:3000";

const tbody   = document.getElementById("tbodyArtistas");
const emptyEl = document.getElementById("emptyMsg");

async function loadArtistas(){
  tbody.innerHTML = "";
  emptyEl.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/artistas`);
    const data = await res.json();
    renderRows(Array.isArray(data) ? data : []);
  }catch(err){
    console.error(err);
    emptyEl.style.display = "block";
    emptyEl.textContent = "Error al cargar artistas.";
  }
}

function renderRows(list){
  if(!list.length){
    emptyEl.style.display = "block";
    return;
  }

  tbody.innerHTML = list.map(a=>{
    const img = a.imagen || `https://placehold.co/80x80?text=${encodeURIComponent(a.nombre)}`;
    const gens = (a.generos || []).map(g => g.nombre).join(", ") || "Sin géneros";
    return `
      <tr data-id="${a.id}">
        <td><img class="thumb" src="${img}" alt="img" onerror="this.src='https://placehold.co/80x80?text=Artista'"/></td>
        <td>${escapeHtml(a.nombre)}</td>
        <td>${escapeHtml(gens)}</td>
        <td>
          <div class="actions">
            <button class="btn" data-action="edit" data-id="${a.id}">Editar</button>
            <button class="btn danger" data-action="del" data-id="${a.id}">Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Delegación de eventos para acciones
  tbody.addEventListener("click", onTableClick, { once: true });
}

async function onTableClick(e){
  const btn = e.target.closest("button[data-action]");
  if(!btn) {
    tbody.addEventListener("click", onTableClick, { once: true });
    return;
  }
  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");

  if(action === "edit"){
    window.location.href = `formArtista.html?id=${id}`;
    return;
  }

  if(action === "del"){
    if(!confirm("¿Seguro que deseas eliminar este artista?")) {
      tbody.addEventListener("click", onTableClick, { once: true });
      return;
    }
    try{
      const resp = await fetch(`${API_BASE}/artistas/${id}`, { method: "DELETE" });
      if(!resp.ok) throw new Error("No se pudo eliminar");
      loadArtistas();
    }catch(err){
      console.error(err);
      alert("No se pudo eliminar el artista");
    }finally{
      tbody.addEventListener("click", onTableClick, { once: true });
    }
  }
}

function escapeHtml(s=""){
  return String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

loadArtistas();
