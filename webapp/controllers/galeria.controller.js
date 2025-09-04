const fs   = require('fs');           // si aún no lo tienes
const path = require('path');    
const db = require("../models");

// Página principal de la galería: muestra fotos y álbumes del usuario actual
exports.obtenerInicio = async (req, res) => {
  const userId = req.currentUser.id;

  const photos = await db.foto.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });

  const albumsRaw = await db.album.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });

  const albums = await withCovers(db, userId, albumsRaw);

  res.render('galeria/index', { photos, albums });
};

exports.obtenerSoloAlbumes = async (req, res) => {
  if (!req.currentUser) return res.redirect("/login");

  const usuarioId = req.currentUser.id;
  const albumes = await db.album.findAll({
    where: { userId: usuarioId },
    order: [["name", "ASC"]],
  });

  res.render("galeria/albums", {
    albums: Array.isArray(albumes) ? albumes : []
  });
};

exports.mostrarFormularioSubida = (req, res) => {
  if (!req.currentUser) return res.redirect("/login");
  res.render("galeria/upload"); // Asegúrate de tener views/galeria/upload.ejs
};


exports.subirImagenes = async (req, res) => {
  if (!req.currentUser) return res.redirect("/login");

  const usuarioId = req.currentUser.id;
  const archivos = req.files || [];
  const albumId = req.body.albumId || null;
  const titulo   = req.body.title || null;  // si luego agregas un input "title"

  await Promise.all(
    archivos.map((f) =>
      db.foto.create({
        userId: usuarioId,
        albumId,
        filename: f.filename,
        OriginalName: f.originalname, // tu modelo usa "OriginalName"
        mimeType: f.mimetype,
        tamano: f.size,               // tu modelo usa "tamano"
        titulo: titulo
      })
    )
  );

  res.redirect("/galeria"); // vuelve al inicio de la galería
};

exports.subirImagenes = async (req, res) => {
  try {
    if (!req.currentUser) return res.redirect('/login');
    if (!req.files || !req.files.photos) {
      req.session.flash = { type: 'danger', text: 'Selecciona al menos una imagen.' };
      return res.redirect('/galeria/upload');
    }

    const usuarioId = req.currentUser.id;
    const files = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];

    // ✅ SOLO aquí: public/uploads
    const userDir = path.join(__dirname, '..', 'public', 'uploads', String(usuarioId));
    fs.mkdirSync(userDir, { recursive: true });

    let guardadas = 0;
    for (const file of files) {
      if (!String(file.mimetype || '').startsWith('image/')) continue;

      const ext = path.extname(file.name);
      const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;

      await file.mv(path.join(userDir, unique));   // <-- EXPRESS-FILEUPLOAD

      await db.foto.create({
        userId: usuarioId,
        filename: unique,
        OriginalName: file.name,
        mimeType: file.mimetype,
        tamano: String(file.size),
        titulo: null
      });

      guardadas++;
    }

    req.session.flash = guardadas > 0
      ? { type: 'success', text: `Se guardó correctamente ${guardadas} imagen${guardadas>1?'es':''}.` }
      : { type: 'danger', text: 'No se pudo guardar ninguna imagen válida.' };

    res.redirect('/galeria/upload');
  } catch (e) {
    console.error('subirImagenes:', e);
    req.session.flash = { type: 'danger', text: 'Ocurrió un error al subir las imágenes.' };
    res.redirect('/galeria/upload');
  }
};

// Servir protegido desde public/uploads
exports.servirFoto = async (req, res) => {
  if (!req.currentUser) return res.redirect('/login');
  const usuarioId = req.currentUser.id;
  const id = req.params.id;

  const foto = await db.foto.findOne({ where: { id, userId: usuarioId } });
  if (!foto) return res.sendStatus(404);

  const filePath = path.join(__dirname, '..', 'public', 'uploads', String(usuarioId), foto.filename);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);


  if (foto.mimeType) res.type(foto.mimeType);
  return res.sendFile(filePath);
};

exports.eliminarFoto = async (req, res) => {
  try {
    if (!req.currentUser) return res.status(401).json({ ok:false, error:'unauthorized' });

    const usuarioId = req.currentUser.id;
    const id = req.params.id;

    // Busca la foto del usuario actual
    const foto = await db.foto.findOne({ where: { id, userId: usuarioId } });
    if (!foto) return res.status(404).json({ ok:false, error:'not_found' });

    // Borra el archivo físico (si existe)
    const filePath = path.join(__dirname, '..', 'public', 'uploads', String(usuarioId), foto.filename);
    try {
      await fs.promises.unlink(filePath);
    } catch (e) {
      if (e.code !== 'ENOENT') console.error('unlink error:', e);
      // si no existe, igual seguimos y borramos el registro
    }

    // Borra el registro de BD
    await foto.destroy();

    return res.json({ ok:true });
  } catch (e) {
    console.error('eliminarFoto error:', e);
    return res.status(500).json({ ok:false, error:'server_error' });
  }
};


async function withCovers(db, userId, albumsRaw) {
  const out = [];
  for (const a of albumsRaw) {
    const last = await db.foto.findOne({
      where: { userId, albumId: a.id },
      order: [['createdAt', 'DESC']],
      attributes: ['id'],
    });
    const plain = a.get({ plain: true });
    plain.coverPhotoId = last ? last.id : null;
    out.push(plain);
  }
  return out;
}

exports.albumsIndex = async (req, res) => {
  const userId = req.currentUser.id;

  const albumsRaw = await db.album.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });

  const albums = await withCovers(db, userId, albumsRaw);

  const flash = req.session.flash || null;
  req.session.flash = null;

  res.render('galeria/albums', { albums, flash });
};

// Crear álbum
exports.albumsCreate = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      req.session.flash = { type: 'danger', text: 'El nombre del álbum es obligatorio.' };
      return res.redirect('/galeria/albums');
    }

    await db.album.create({
      userId,
      name: name.trim(),
      description: (description || '').trim() || null,
    });

    req.session.flash = { type: 'success', text: 'Álbum creado correctamente.' };
    return res.redirect('/galeria/albums');
  } catch (e) {
    console.error('albumsCreate error:', e);
    req.session.flash = { type: 'danger', text: 'No se pudo crear el álbum.' };
    return res.redirect('/galeria/albums');
  }
};

// Devuelve datos del álbum + sus fotos (JSON) para el modal
exports.albumsJson = async (req, res) => {
  try {
    const userId  = req.currentUser.id;
    const albumId = req.params.id;

    const album = await db.album.findOne({ where: { id: albumId, userId } });
    if (!album) return res.status(404).json({ ok: false, error: 'album_not_found' });

    const fotos = await db.foto.findAll({
      where: { userId, albumId },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'filename', 'titulo', 'OriginalName', 'mimeType', 'createdAt']
    });

    const photos = fotos.map(f => ({
      id: f.id,
      title: f.titulo || f.OriginalName || f.filename
    }));

    return res.json({
      ok: true,
      album: { id: album.id, name: album.name, description: album.description },
      photos
    });
  } catch (e) {
    console.error('albumsJson error:', e);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
};

// Sube imágenes directamente a un álbum (desde el modal)
exports.subirImagenesAAlbum = async (req, res) => {
  try {
    const userId  = req.currentUser.id;
    const albumId = req.params.id;

    // valida pertenencia del álbum
    const album = await db.album.findOne({ where: { id: albumId, userId } });
    if (!album) return res.status(404).json({ ok: false, error: 'album_not_found' });

    if (!req.files || !req.files.photos) {
      return res.status(400).json({ ok: false, error: 'no_files' });
    }

    const files = Array.isArray(req.files.photos) ? req.files.photos : [req.files.photos];

    const userDir = path.join(__dirname, '..', 'public', 'uploads', String(userId));
    fs.mkdirSync(userDir, { recursive: true });

    const created = [];

    for (const file of files) {
      if (!String(file.mimetype || '').startsWith('image/')) continue;

      const ext    = path.extname(file.name);
      const unique = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;

      await file.mv(path.join(userDir, unique));

      const row = await db.foto.create({
        userId,
        albumId,
        filename: unique,
        OriginalName: file.name,
        mimeType: file.mimetype,
        tamano: String(file.size),
        titulo: null
      });

      created.push({
        id: row.id,
        title: row.titulo || row.OriginalName || row.filename
      });
    }

    return res.json({ ok: true, created });
  } catch (e) {
    console.error('subirImagenesAAlbum error:', e);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
};

// POST /galeria/fotos/:id/album  { albumId }
exports.setPhotoAlbum = async (req, res) => {
  try {
    const userId = req.currentUser.id;

    // id de la foto
    const photoId = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(photoId)) {
      return res.status(400).json({ ok: false, error: 'bad_photo_id' });
    }

    // albumId puede venir string; normalizamos. Si no viene => quitar del álbum
    let { albumId } = req.body || {};
    if (albumId === '' || albumId === undefined) albumId = null;
    if (albumId !== null) {
      albumId = Number.parseInt(albumId, 10);
      if (!Number.isInteger(albumId)) {
        return res.status(400).json({ ok: false, error: 'bad_album_id' });
      }
    }

    // Usa el nombre de modelo que tengas exportado
    const Foto  = (db.foto  || db.Foto);
    const Album = (db.album || db.Album);

    // Verifica que la foto sea del usuario
    const photo = await Foto.findOne({ where: { id: photoId, userId } });
    if (!photo) return res.status(404).json({ ok: false, error: 'not_found' });

    // Si albumId es null => quitar la foto del álbum
    if (albumId === null) {
      await photo.update({ albumId: null });
      return res.json({ ok: true });
    }

    // Verifica que el álbum sea del usuario
    const album = await Album.findOne({ where: { id: albumId, userId } });
    if (!album) return res.status(404).json({ ok: false, error: 'album_not_found' });

    // Asignar foto -> álbum
    await photo.update({ albumId });
    return res.json({ ok: true });
  } catch (err) {
    console.error('setPhotoAlbum error:', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
};


exports.albumsListJson = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    // Ajusta db.album a como exportas tus modelos: db.album / db.Album
    const albums = await db.album.findAll({
      where: { userId },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
    return res.json({ ok: true, albums });
  } catch (e) {
    console.error('albumsListJson error:', e);
    return res.status(500).json({ ok: false });
  }
};
