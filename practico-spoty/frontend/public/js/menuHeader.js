// public/js/headerMenu.js
(() => {
  const header = document.querySelector('.header-titulo');
  if (!header) return;

  // Asegura contenedor de acciones en el header
  let actions = header.querySelector('.acciones-header');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'acciones-header';
    header.appendChild(actions);
  }

  // Detectar página actual
  const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';

  // Botón Inicio (solo si NO estamos en index.html)
  if (!isIndex) {
    const btnInicio = document.createElement('a');
    btnInicio.className = 'btninicio';
    btnInicio.href = 'index.html';
    btnInicio.textContent = 'Inicio';
    actions.appendChild(btnInicio);
  }

  // Helper: crea un dropdown
  function makeDropdown(label, items) {
    const wrap = document.createElement('div');
    wrap.className = 'dropdown';

    const btn = document.createElement('button');
    btn.className = 'dropbtn';
    btn.textContent = `${label} ▾`;

    const content = document.createElement('div');
    content.className = 'dropdown-content';

    items.forEach(([text, href]) => {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      content.appendChild(a);
    });

    wrap.appendChild(btn);
    wrap.appendChild(content);
    return wrap;
  }

  // Dropdown: Géneros
  actions.appendChild(
    makeDropdown('Géneros', [
      ['Ver géneros', 'index.html'],
      ['Nuevo género', 'formGenero.html'],
    ])
  );

  // Dropdown: Artistas
  actions.appendChild(
    makeDropdown('Artistas', [
      ['Ver artistas', 'artistas.html'],
      ['Nuevo artista', 'formArtista.html'],
    ])
  );
})();
