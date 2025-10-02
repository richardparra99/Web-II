const API_BASE = "http://localhost:3000";

const tbody   = document.getElementById("tbodyCanciones");
const emptyEl = document.getElementById("emptyMsg");

async function loadCanciones(){
  tbody.innerHTML = "";
  emptyEl.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/canciones`);
    const data = await res.json();
    renderRows(Array.isArray(data) ? data : []);
  }catch(err){
    console.error(err);
    emptyEl.style.display = "block";
    emptyEl.textContent = "Error al cargar canciones.";
  }
}

function renderRows(list){
  if(!list.length){
    emptyEl.style.display = "block";
    return;
  }

  tbody.innerHTML = list.map(c=>{
    const album   = c.album ? c.album.nombre : "Sin álbum";
    const artista = c.album && c.album.artista ? c.album.artista.nombre : "Desconocido";
    const audio   = c.archivo || "";
    return `
      <tr data-id="${c.id}">
        <td>${escapeHtml(c.nombre)}</td>
        <td>${escapeHtml(album)}</td>
        <td>${escapeHtml(artista)}</td>
        <td>
          ${audio ? `
            <audio controls style="width:200px;">
              <source src="${audio}" type="audio/mpeg">
            </audio>` : `<span style="color:#8b94a7">Sin archivo</span>`
          }
        </td>
        <td>
          <div class="actions">
            <button class="btn" data-action="edit" data-id="${c.id}">Editar</button>
            <button class="btn danger" data-action="del" data-id="${c.id}">Eliminar</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  tbody.addEventListener("click", onTableClick, { once: true });
}

async function onTableClick(e){
  const btn = e.target.closest("button[data-action]");
  if(!btn){
    tbody.addEventListener("click", onTableClick, { once: true });
    return;
  }
  const id = btn.getAttribute("data-id");
  const action = btn.getAttribute("data-action");

  if(action === "edit"){
    window.location.href = `formCancion.html?id=${id}`;
    return;
  }

  if(action === "del"){
    if(!confirm("¿Seguro que deseas eliminar esta canción?")) {
      tbody.addEventListener("click", onTableClick, { once: true });
      return;
    }
    try{
      const resp = await fetch(`${API_BASE}/canciones/${id}`, { method: "DELETE" });
      if(!resp.ok) throw new Error("No se pudo eliminar");
      loadCanciones();
    }catch(err){
      console.error(err);
      alert("No se pudo eliminar la canción");
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

loadCanciones();
