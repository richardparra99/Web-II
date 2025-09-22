const db = require("../models");

exports.getAllGeneros = async (req, res) => {
  try {
    const generos = await db.genero.findAll({ order: [["nombre", "ASC"]] });
    res.json(generos);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los géneros" });
  }
};

exports.getGeneroById = async (req, res) => {
  res.json(req.obj);
};

exports.crearGenero = async (req, res) => {
  try {
    const { nombre } = req.body;        // viene en multipart/form-data
    const imagenPath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const nuevo = await db.genero.create({
      nombre: String(nombre).trim(),
      imagen: imagenPath
    });

    return res.status(201).json(nuevo);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el genero" });
  }
};

exports.actualizarGeneroPut = async (req, res) => {
  try {
    const { nombre } = req.body;        // en multipart/form-data
    const genero = req.obj;

    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    genero.nombre = String(nombre).trim();

    // si subieron archivo nuevo, reemplaza la ruta de imagen
    if (req.file) {
      const imagenPath = `/uploads/${req.file.filename}`;
      genero.imagen = imagenPath;
    } else if (typeof req.body.imagen !== "undefined") {
      // si quisieras permitir "limpiar" la imagen enviando imagen=""
      genero.imagen = req.body.imagen || null;
    }

    await genero.save();
    return res.json(genero);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar genero" });
  }
};

exports.actualizarGeneroPatch = async (req, res) => {
  try {
    const { nombre } = req.body;
    const genero = req.obj;

    if (typeof nombre !== "undefined") {
      const n = String(nombre).trim();
      if (!n) return res.status(400).json({ error: "El nombre no puede ser vacío" });
      genero.nombre = n;
    }

    if (req.file) {
      const imagenPath = `/uploads/${req.file.filename}`;
      genero.imagen = imagenPath;
    } else if (typeof req.body.imagen !== "undefined") {
      // permitir limpiar imagen con imagen=""
      genero.imagen = req.body.imagen || null;
    }

    await genero.save();
    return res.json(genero);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el genero" });
  }
};

exports.eliminarGenero = async (req, res) => {
  try {
    const genero = req.obj;
    await genero.destroy();
    return res.json({ message: "Genero eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el genero" });
  }
};