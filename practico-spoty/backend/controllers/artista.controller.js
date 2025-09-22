const db = require("../models");

exports.getAllArtistas = async (req, res) => {
  try {
    const artistas = await db.artista.findAll({
      order: [["nombre", "ASC"]],
      include: [{ model: db.genero, as: "generos", through: { attributes: [] } }],
    });
    res.json(artistas);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener artistas" });
  }
};

exports.getArtistasById = async (req, res) => {
  try {
    const art = await db.artista.findByPk(req.obj.id, {
      include: [{ model: db.genero, as: "generos", through: { attributes: [] } }],
    });
    if (!art) return res.status(404).json({ error: "Artista no encontrado" });
    res.json(art);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el artista" });
  }
};

exports.crearArtistas = async (req, res) => {
  try {
    const { nombre } = req.body; // multipart/form-data
    const imagenPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const nuevo = await db.artista.create({
      nombre: String(nombre).trim(),
      imagen: imagenPath,
    });

    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear al artista" });
  }
};

exports.actulizarArtistaPut = async (req, res) => {
  try {
    const { nombre } = req.body;
    const art = req.obj;

    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    art.nombre = String(nombre).trim();

    if (req.file) {
      art.imagen = `/uploads/${req.file.filename}`;
    } else if (typeof req.body.imagen !== "undefined") {
      // permite limpiar imagen enviando imagen=""
      art.imagen = req.body.imagen || null;
    }

    await art.save();
    return res.json(art);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar artista" });
  }
};

exports.actualizarArtistaPatch = async (req, res) => {
  try {
    const { nombre } = req.body;
    const art = req.obj;

    if (typeof nombre !== "undefined") {
      const n = String(nombre).trim();
      if (!n) return res.status(400).json({ error: "El nombre no puede ser vacío" });
      art.nombre = n;
    }

    if (req.file) {
      art.imagen = `/uploads/${req.file.filename}`;
    } else if (typeof req.body.imagen !== "undefined") {
      art.imagen = req.body.imagen || null;
    }

    await art.save();
    return res.json(art);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar al artista" });
  }
};

exports.eliminarArtista = async (req, res) => {
  try {
    const art = req.obj;
    await art.destroy();
    return res.json({ message: "Artista eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar al artista" });
  }
};

exports.setGeneros = async (req, res) => {
  try {
    const { generos } = req.body;
    const art = req.obj; // viene del getObjectOr404
    await art.setGeneros(generos);
    const withGen = await db.artista.findByPk(art.id, {
      include: [{ model: db.genero, as: "generos", through: { attributes: [] } }],
    });
    return res.json(withGen);
  } catch (error) {
    return res.status(500).json({ error: "Error al asignar generos al artista" });
  }
};

exports.addGeneros = async (req, res) => {
  try {
    const art = req.obj; // getObjectOr404
    const { generoId } = req.params;
    const gen = await db.genero.findByPk(generoId);
    if (!gen) return res.status(404).json({ error: "Genero no encontrado" });

    // Por el alias "generos" Sequelize genera addGenero/addGeneros. Ambas suelen existir.
    if (typeof art.addGenero === "function") {
      await art.addGenero(gen);
    } else {
      await art.addGeneros(gen);
    }

    const withGen = await db.artista.findByPk(art.id, {
      include: [{ model: db.genero, as: "generos", through: { attributes: [] } }],
    });
    return res.json(withGen);
  } catch (error) {
    return res.status(500).json({ error: "Error al agregar genero" });
  }
};

exports.getGenerosDeArtista = async (req, res) => {
  try {
    const art = await db.artista.findByPk(req.params.id, {
      include: [{ model: db.genero, as: "generos", through: { attributes: [] } }],
    });
    if (!art) return res.status(404).json({ error: "Artista no encontrado" });
    return res.json(art.generos || []);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los géneros del artista" });
  }
};

exports.removeGenero = async (req, res) => {
  try {
    const art = req.obj;
    const { generoId } = req.params;
    await art.removeGenero(generoId);
    const withGen = await db.artista.findByPk(art.id, {
      include: [{ model: db.genero, as: "generos", through: { attributes: [] } }],
    });
    return res.json(withGen);
  } catch (error) {
    return res.status(500).json({ error: "Error al quitar genero" });
  }
};