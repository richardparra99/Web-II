const db = require("../models");

function getUploadUrl(file) {
  if (!file) return null;
  return `/uploads/${file.filename}`; // mismo patrón que álbum/artista
}

exports.getAllCanciones = async (req, res) => {
  try {
    const canciones = await db.cancion.findAll({
      order: [["nombre", "ASC"]],
      include: [{ model: db.album, as: "album", include: [{ model: db.artista, as: "artista" }] }],
    });
    res.json(canciones);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al obtener canciones" });
  }
};

exports.getCancionById = async (req, res) => {
  try {
    const c = await db.cancion.findByPk(req.obj.id, {
      include: [{ model: db.album, as: "album", include: [{ model: db.artista, as: "artista" }] }],
    });
    res.json(c);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al obtener la canción" });
  }
};

exports.crearCancion = async (req, res) => {
  try {
    const { nombre, albumId } = req.body;

    const alb = await db.album.findByPk(albumId);
    if (!alb) return res.status(404).json({ error: "Álbum no encontrado" });

    const archivo = getUploadUrl(req.file);

    const nueva = await db.cancion.create({
      nombre: String(nombre).trim(),
      albumId: Number(albumId),
      archivo: archivo ?? null,
    });

    const withAlbum = await db.cancion.findByPk(nueva.id, {
      include: [{ model: db.album, as: "album", include: [{ model: db.artista, as: "artista" }] }],
    });
    return res.status(201).json(withAlbum);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al crear la canción" });
  }
};

exports.actualizarCancionPut = async (req, res) => {
  try {
    const { nombre, albumId } = req.body;
    const c = req.obj;

    if (albumId) {
      const alb = await db.album.findByPk(albumId);
      if (!alb) return res.status(404).json({ error: "Álbum no encontrado" });
      c.albumId = Number(albumId);
    }

    c.nombre = String(nombre).trim();

    const archivo = getUploadUrl(req.file);
    if (archivo) c.archivo = archivo;

    await c.save();

    const withAlbum = await db.cancion.findByPk(c.id, {
      include: [{ model: db.album, as: "album", include: [{ model: db.artista, as: "artista" }] }],
    });
    return res.json(withAlbum);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al actualizar la canción" });
  }
};

exports.actualizarCancionPatch = async (req, res) => {
  try {
    const { nombre, albumId } = req.body;
    const c = req.obj;

    if (typeof nombre !== "undefined") c.nombre = String(nombre).trim();

    if (typeof albumId !== "undefined") {
      const alb = await db.album.findByPk(albumId);
      if (!alb) return res.status(404).json({ error: "Álbum no encontrado" });
      c.albumId = Number(albumId);
    }

    const archivo = getUploadUrl(req.file);
    if (archivo) c.archivo = archivo;

    await c.save();

    const withAlbum = await db.cancion.findByPk(c.id, {
      include: [{ model: db.album, as: "album", include: [{ model: db.artista, as: "artista" }] }],
    });
    return res.json(withAlbum);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al actualizar la canción" });
  }
};

exports.eliminarCancion = async (req, res) => {
  try {
    const c = req.obj;
    await c.destroy();
    return res.json({ message: "Canción eliminada correctamente" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al eliminar la canción" });
  }
};
