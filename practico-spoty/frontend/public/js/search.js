// public/js/search.js
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:3000";

  const $inp = document.getElementById("globalSearch");
  const $btn = document.getElementById("btnSearch");

  // Panel de resultados a pantalla completa
  const $home = document.getElementById("homeContent");
  const $panel = document.getElementById("searchPanel");
  const $srGenerosBlock = document.getElementById("srGenerosBlock");
  const $srArtistasBlock = document.getElementById("srArtistasBlock");
  const $srAlbumsBlock  = document.getElementById("srAlbumsBlock");
  const $srSongsBlock   = document.getElementById("srSongsBlock");
  const $srGeneros = document.getElementById("srGeneros");
  const $srArtistas = document.getElementById("srArtistas");
  const $srAlbums  = document.getElementById("srAlbums");
  const $srSongs   = document.getElementById("srSongs");
  const $srEmpty   = document.getElementById("srEmpty");

  if (!$inp || !$btn) return;

  // ===== Mostrar / ocultar panel =====
  function showHome() {
    if ($panel) $panel.style.display = "none";
    if ($home)  $home.style.display = "block";
  }

  function showResultsPanel() {
    if ($home)  $home.style.display = "none";
    if ($panel) $panel.style.display = "block";
  }

  // ===== Ejecutar búsqueda =====
  async function runFullSearch(q) {
    const qq = String(q || "").trim();
    if (!qq) { showHome(); return; }

    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(qq)}`);
      if (!res.ok) throw new Error("bad");
      const data = await res.json();
      renderFullResults(data);
    } catch (err) {
      console.error(err);
      showHome();
    }
  }

  function renderFullResults(data) {
    showResultsPanel();

    const { generos = [], artistas = [], albums = [], canciones = [] } = data || {};

    // Géneros
    if (generos.length) {
      $srGenerosBlock.style.display = "block";
      $srGeneros.innerHTML = generos.map(g => {
        const img = g.imagen || `https://placehold.co/300x300?text=${encodeURIComponent(g.nombre)}`;
        return `
          <article class="card" data-go="artistas" data-id="${g.id}" data-name="${escapeHtml(g.nombre)}" style="cursor:pointer">
            <img src="${img}" alt="Género ${escapeHtml(g.nombre)}" onerror="this.src='https://placehold.co/300x300?text=Genero'">
            <div class="card-body"><h3 class="card-title">${escapeHtml(g.nombre)}</h3></div>
          </article>`;
      }).join("");
      $srGeneros.querySelectorAll("[data-go]").forEach(el => {
        el.addEventListener("click", () => {
          const id = el.getAttribute("data-id");
          const name = el.getAttribute("data-name");
          window.location.href = `artistas.html?generoId=${id}&nombre=${encodeURIComponent(name)}`;
        });
      });
    } else {
      $srGenerosBlock.style.display = "none";
    }

    // Artistas
    if (artistas.length) {
      $srArtistasBlock.style.display = "block";
      $srArtistas.innerHTML = artistas.map(a => {
        const img = a.imagen || `https://placehold.co/300x300?text=${encodeURIComponent(a.nombre)}`;
        return `
          <article class="card" data-go="albums" data-id="${a.id}" data-name="${escapeHtml(a.nombre)}" style="cursor:pointer">
            <img src="${img}" alt="Artista ${escapeHtml(a.nombre)}" onerror="this.src='https://placehold.co/300x300?text=Artista'">
            <div class="card-body"><h3 class="card-title">${escapeHtml(a.nombre)}</h3></div>
          </article>`;
      }).join("");
      $srArtistas.querySelectorAll("[data-go]").forEach(el => {
        el.addEventListener("click", () => {
          const id = el.getAttribute("data-id");
          const name = el.getAttribute("data-name");
          window.location.href = `albums.html?artistaId=${id}&nombre=${encodeURIComponent(name)}`;
        });
      });
    } else {
      $srArtistasBlock.style.display = "none";
    }

    // Álbumes
    if (albums.length) {
      $srAlbumsBlock.style.display = "block";
      $srAlbums.innerHTML = albums.map(a => {
        const img = a.imagen || `https://placehold.co/300x300?text=${encodeURIComponent(a.nombre)}`;
        const artista = a.artista ? a.artista.nombre : "—";
        return `
          <article class="card" data-go="songs" data-id="${a.id}" data-name="${escapeHtml(a.nombre)}" style="cursor:pointer">
            <img src="${img}" alt="Álbum ${escapeHtml(a.nombre)}" onerror="this.src='https://placehold.co/300x300?text=Album'">
            <div class="card-body">
              <h3 class="card-title">${escapeHtml(a.nombre)}</h3>
              <p style="margin:.25rem 0;color:#8b94a7;font-size:13px">${escapeHtml(artista)}</p>
            </div>
          </article>`;
      }).join("");
      $srAlbums.querySelectorAll("[data-go]").forEach(el => {
        el.addEventListener("click", () => {
          const id = el.getAttribute("data-id");
          const name = el.getAttribute("data-name");
          window.location.href = `canciones.html?albumId=${id}&nombre=${encodeURIComponent(name)}`;
        });
      });
    } else {
      $srAlbumsBlock.style.display = "none";
    }

    // Canciones
    if (canciones.length) {
      $srSongsBlock.style.display = "block";
      $srSongs.innerHTML = canciones.map(c => {
        const audioSrc = c.archivo || "";
        const album = c.album?.nombre || "—";
        const artista = c.album?.artista?.nombre || "—";
        return `
          <article class="card">
            <div class="card-body">
              <h3 class="card-title">${escapeHtml(c.nombre)}</h3>
              <p style="margin:.25rem 0;color:#8b94a7;font-size:13px">${escapeHtml(artista)} - ${escapeHtml(album)}</p>
              ${audioSrc ? `<audio controls style="width:100%; margin-top:6px"><source src="${audioSrc}" type="audio/mpeg"></audio>` : ""}
            </div>
          </article>`;
      }).join("");
    } else {
      $srSongsBlock.style.display = "none";
    }

    $srEmpty.style.display = (!generos.length && !artistas.length && !albums.length && !canciones.length) ? "block" : "none";
  }

  function escapeHtml(s = "") {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Eventos
  $inp.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      runFullSearch($inp.value);
    }
    if (ev.key === "Escape") {
      if (!$inp.value.trim()) showHome();
    }
  });

  $btn.addEventListener("click", (e) => {
    e.preventDefault();
    runFullSearch($inp.value);
  });
});
