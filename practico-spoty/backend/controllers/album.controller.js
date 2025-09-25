const db = require("../models");
const { deleteUpload } = require("../utils/deleteUpload");

function getUploadUrl(file) {
  if (!file) return null;
  return `/uploads/${file.filename}`;
}

exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await db.album.findAll({
      order: [["nombre", "ASC"]],
      include: [{ model: db.artista, as: "artista" }],
    });
    res.json(albums);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener álbumes" });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const alb = await db.album.findByPk(req.obj.id, {
      include: [{ model: db.artista, as: "artista" }],
    });
    res.json(alb);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener álbum" });
  }
};

exports.crearAlbum = async (req, res) => {
  try {
    const { nombre, artistaId } = req.body;

    // validar artista
    const art = await db.artista.findByPk(artistaId);
    if (!art) return res.status(404).json({ error: "Artista no encontrado" });

    const imagen = getUploadUrl(req.file);

    const nuevo = await db.album.create({
      nombre,
      artistaId,
      imagen: imagen ?? null,
    });

    const withArtist = await db.album.findByPk(nuevo.id, {
      include: [{ model: db.artista, as: "artista" }],
    });
    return res.status(201).json(withArtist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear el álbum" });
  }
};

exports.actualizarAlbumPut = async (req, res) => {
  try {
    const { nombre, artistaId } = req.body;
    const alb = req.obj;

    if (artistaId) {
      const art = await db.artista.findByPk(artistaId);
      if (!art) return res.status(404).json({ error: "Artista no encontrado" });
      alb.artistaId = artistaId;
    }

    alb.nombre = nombre;
    const imagen = getUploadUrl(req.file);
    if (imagen) alb.imagen = imagen;

    await alb.save();

    const withArtist = await db.album.findByPk(alb.id, {
      include: [{ model: db.artista, as: "artista" }],
    });
    return res.json(withArtist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar el álbum" });
  }
};

exports.actualizarAlbumPatch = async (req, res) => {
  try {
    const { nombre, artistaId } = req.body;
    const alb = req.obj;

    if (typeof nombre !== "undefined") alb.nombre = nombre;

    if (typeof artistaId !== "undefined") {
      const art = await db.artista.findByPk(artistaId);
      if (!art) return res.status(404).json({ error: "Artista no encontrado" });
      alb.artistaId = artistaId;
    }

    const imagen = getUploadUrl(req.file);
    if (imagen) alb.imagen = imagen;

    await alb.save();

    const withArtist = await db.album.findByPk(alb.id, {
      include: [{ model: db.artista, as: "artista" }],
    });
    return res.json(withArtist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar el álbum" });
  }
};

exports.eliminarAlbum = async (req, res) => {
  try {
    const alb = req.obj;
    deleteUpload(alb.imagen);
    await alb.destroy();
    return res.json({ message: "Álbum eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar el álbum" });
  }
};
