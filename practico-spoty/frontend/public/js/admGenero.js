const API_BASE = "http://localhost:3000";

const tbody   = document.getElementById("tbodyGeneros");
const emptyEl = document.getElementById("emptyMsg");

async function loadGeneros(){
  tbody.innerHTML = "";
  emptyEl.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/generos`);
    const data = await res.json();
    renderRows(Array.isArray(data) ? data : []);
  }catch(err){
    console.error(err);
    emptyEl.style.display = "block";
    emptyEl.textContent = "Error al cargar géneros.";
  }
}

function renderRows(list){
  if(!list.length){
    emptyEl.style.display = "block";
    return;
  }

  tbody.innerHTML = list.map(g=>{
    const img = g.imagen || `https://placehold.co/80x80?text=${encodeURIComponent(g.nombre)}`;
    return `
      <tr data-id="${g.id}">
        <td><img class="thumb" src="${img}" alt="img" onerror="this.src='https://placehold.co/80x80?text=Genero'"/></td>
        <td>${escapeHtml(g.nombre)}</td>
        <td>
          <div class="actions">
            <button class="btn" data-action="edit" data-id="${g.id}">Editar</button>
            <button class="btn danger" data-action="del" data-id="${g.id}">Eliminar</button>
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
    // rearmar delegación si se clickea fuera
    tbody.addEventListener("click", onTableClick, { once: true });
    return;
  }
  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");

  if(action === "edit"){
    // ir al form de edición
    window.location.href = `formGenero.html?id=${id}`;
  }

  if(action === "del"){
    if(!confirm("¿Seguro que deseas eliminar este género?")) {
      tbody.addEventListener("click", onTableClick, { once: true });
      return;
    }
    try{
      const resp = await fetch(`${API_BASE}/generos/${id}`, { method: "DELETE" });
      if(!resp.ok) throw new Error("No se pudo eliminar");
      loadGeneros();
    }catch(err){
      console.error(err);
      alert("No se pudo eliminar el género");
    }finally{
      // rearmar delegación
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

loadGeneros();
