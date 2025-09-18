const db = require("../models");

exports.getAllGeneros = async (req, res) => {
    const generos = await db.genero.findAll({orden: [["nombre", "ASC"]]});
    res.json(generos);
}

exports.getGeneroById = async (req, res) => {
    res.json(req.obj);
};

exports.crearGenero = async (req, res) => {
    try {
        const { nombre, imagen } = req.body;
        const nuevo = await db.genero.create({ 
            nombre,
            imagen: imagen ?? null
        });
        return res.status(201).json(nuevo);
    } catch (error) {
        return res.status(500).json({ error: "Error al crear el genero"});
    }
};

exports.actualizarGeneroPut = async (req, res) => {
    try {
        const {nombre, imagen} = req.body;
        const genero = req.obj;
        genero.nombre = nombre;
        genero.imagen = imagen ?? null;
        await genero.save();
        return res.json(genero);
    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar genero"});
    }
};

exports.actualizarGeneroPatch = async (req, res) => {
    try {
        const {nombre, imagen} = req.body;
        const genero = req.obj;
        if(nombre) {
            genero.nombre = nombre;
        }
        if (typeof imagen !== "undefined"){
            genero.imagen = imagen;
        }
        await genero.save();
        return res.json(genero);
    } catch (error) {
        return res.status(500).json({ error: "Error al actualizar el genero"})
    }
};

exports.elimilarGenero = async (req, res) => {
    try {
        const genero = req.obj;
        await genero.destroy();
        return res.json({message: "Genero eliminado Correctamente"});
    } catch (error) {
        return res.status(500).json({error: "Error al eliminar el genero"});
    }
}