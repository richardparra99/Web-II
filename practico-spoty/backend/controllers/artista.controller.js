const db = require("../models");

exports.getAllArtistas = async (req, res) => {
    const artistas = await db.artista.findAll({
        order: [["nombre", "ASC"]],
        include: [{model: db.genero, as: "generos", through: { attributes: []}}]
    });
    res.json(artistas);
};

exports.getArtistasById = async (req, res) => {
    const art = await db.artista.findByPk(req.obj.id, {
        include: [{model: db.genero, as: "generos", through: {attributes: []}}]
    });
    res.json(art);
};

exports.crearArtistas = async (req, res) => {
    try {
        const {nombre, imagen} = req.body;
        const nuevo = await db.artista.create({
            nombre,
            imagen: imagen ?? null
        });
        return res.status(201).json(nuevo);
    } catch (error) {
        return res.status(500).json({ error: "Error al crear al artista"});
    }
};

exports.actulizarArtistaPut = async (req, res) => {
    try {
        const {nombre, imagen} = req.body;
        const art = req.obj;
        art.nombre = nombre;
        art.imagen = imagen ?? null;
        await art.save();
        return res.json(art);
    } catch (error) {
        return res.status(500).json({error: "Error al actualizar persona"});
    }
};

exports.actualizarArtistaPatch = async (req, res) => {
    try {
        const { nombre, imagen } = req.body;
        const art = req.obj;
        if(nombre){
            art.nombre = nombre;
        }
        if(typeof imagen !== "undefined"){
            art.imagen = imagen;
        }
        await art.save();
        return res.json(art);
    } catch (error) {
        return res.status(500).json({error: "Error al actualizar al artista"});
    }
};

exports.eliminarArtista = async (req, res) => {
    try {
        const art = req.obj;
        await art.destroy();
        return res.json({message: "Artista eliminado correctamente"});
    } catch (error) {
        return res.status(500).json({error: "Error al eliminar al artista"});
    }
};

exports.setGeneros = async (req, res) => {
    try {
        const {generos} = req.body;
        const art = req.obj;
        await art.setGeneros(generos);
        const withGen = await db.artista.findByPk(art.id, {
            include: [{model: db.genero, as: "generos", through: {attributes: []}}]
        });
        return res.json(withGen);
    } catch (error) {
        return res.status(500).json({error: "Error al asignar generos al artista"});
    }
};

exports.addGeneros = async (req, res) => {
    try {
        const art = req.obj;
        const {generoId} = req.params;
        const gen = await db.genero.findByPk(generoId);
        if(!gen){
            return res.status(404).json({error: "Genero no encontrado"});
        }
        await art.addGeneros(gen);
        const withGen = await db.artista.findByPk(art.id, {
            include: [{model: db.genero, as: "generos", through: {attributes: []}}]
        });
        return res.json(withGen);
    } catch (error) {
        return res.status(500).json({error: "Error al agregar genero"});
    }
};

exports.removeGenero = async (req, res) => {
    try {
        const art = req.obj;
        const {generoId} = req.params;
        await art.removeGenero(generoId);
        const withGen = await db.artista.findByPk(art.id, {
            include: [{model: db.genero, as: "generos", through: {attributes: []}}]
        });
        return res.json(withGen);
    } catch (error) {
        return res.status(500).json({error: "Error al quitar genero"});
    }
};

exports.getGenerosDeArtista = async (req, res) => {
    const art = await db.artista.findByPk(art.id, {
        include: [{model: db.genero, as: "generos", through: {attributes: []}}]
    });
    return res.json(art?.generos ?? []);
};