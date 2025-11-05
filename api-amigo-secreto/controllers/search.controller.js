const { Op, fn, col, where } = require("sequelize");
const db = require("../models");

const iLikeNombre = (q, alias) =>
  where(fn("lower", col(`${alias}.nombre`)), { [Op.like]: `%${String(q).toLowerCase()}%` });

exports.globalSearch = async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) {
    return res.json({ generos: [], artistas: [], albums: [], canciones: [] });
  }

  try {
    const [generos, artistas, albums, canciones] = await Promise.all([
      db.genero.findAll({
        where: iLikeNombre(q, "Genero"),
        order: [["nombre", "ASC"]],
      }),

      db.artista.findAll({
        where: iLikeNombre(q, "Artistas"),
        order: [["nombre", "ASC"]],
      }),

      db.album.findAll({
        where: iLikeNombre(q, "Album"),
        include: [{ model: db.artista, as: "artista" }],
        order: [["nombre", "ASC"]],
      }),

      db.cancion.findAll({
        where: iLikeNombre(q, "Cancion"),
        include: [
          {
            model: db.album,
            as: "album",
            include: [{ model: db.artista, as: "artista" }],
          },
        ],
        order: [["nombre", "ASC"]],
      }),
    ]);

    res.json({ generos, artistas, albums, canciones });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al realizar la búsqueda" });
  }
};
