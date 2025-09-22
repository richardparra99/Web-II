const API_BASE = "http://localhost:3000";

const grid  = document.getElementById("albumsGrid");
const empty = document.getElementById("albumsEmpty");

async function loadAlbums(){
  grid.innerHTML = "";
  empty.style.display = "none";
  try{
    const res = await fetch(`${API_BASE}/albums`);
    const data = await res.json();
    renderAlbums(Array.isArray(data) ? data : []);
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
  grid.innerHTML = list.map(alb=>{
    const img = alb.imagen || `https://placehold.co/300x300?text=Album`;
    const artistaNombre = alb.artista?.nombre || "";
    return `
      <article class="card">
        <img src="${img}" alt="Álbum ${escapeHtml(alb.nombre)}"
             onerror="this.src='https://placehold.co/300x300?text=Album'">
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(alb.nombre)}</h3>
          <p style="margin:.25rem 0;color:#8b94a7;font-size:13px">${escapeHtml(artistaNombre)}</p>
          <div style="margin-top:8px; display:flex; gap:6px;">
            <button class="btn-edit" data-id="${alb.id}">Editar</button>
            <button class="btn-del"  data-id="${alb.id}">Eliminar</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".btn-edit").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-id");
      window.location.href = `formAlbum.html?id=${id}`;
    });
  });

  grid.querySelectorAll(".btn-del").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const id = btn.getAttribute("data-id");
      if (!confirm("¿Seguro que deseas eliminar este álbum?")) return;
      try{
        const res = await fetch(`${API_BASE}/albums/${id}`, { method: "DELETE" });
        if(!res.ok) throw new Error();
        loadAlbums();
      }catch(e){
        console.error(e);
        alert("No se pudo eliminar el álbum");
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

loadAlbums();
