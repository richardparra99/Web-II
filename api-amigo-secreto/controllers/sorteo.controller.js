const db = require("../models");
const { generateAuthToken } = require("../utils/text.utilities");

exports.getAllSorteos = async (req, res) => {
    try {
        const sorteos = await db.sorteo.findAll({
            where: {
                idUsuario: req.user.id
            },
            include: [{
                model: db.participante, as: "participantes"
            }]
        });
        res.json(sorteos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los sorteos" });
    }
};

exports.crearSorteos = async (req, res) => {
    const { nombre, fecha } = req.body;
    try {
        const hashAcceso = generateAuthToken(nombre);
        const sorteo = await db.sorteo.create({
            nombre,
            fecha,
            hashAcceso,
            idUsuario: req.user.id,
            iniciado: false
        });
        res.status(201).json(sorteo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear un sorteo" });
    }
};

exports.ActualizarSorteos = async (req, res) => {
    const { nombre, fecha } = req.body;
    try {
        const sorteo = await db.sorteo.findByPk(req.params.id);
        if (!sorteo)
            return res.status(404).json({ error: "Sorteo no encontrado" });
        if (sorteo.iniciado)
            return res.status(400).json({ error: "Nose puede editar un sorteo iniciado" });
        if (nombre) sorteo.nombre = nombre;
        if (fecha) sorteo.fecha = fecha;

        await sorteo.save();
        res.json(sorteo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el sorteo" });
    }
};

exports.actualizarSorteoPatch = async (req, res) => {
    const { nombre, fecha } = req.body;
    try {
        const sorteo = req.obj;
        if (sorteo.iniciado) {
            return res.status(400).json({ error: "No se puede modificar un sorteo ya iniciado" });
        }

        if (nombre) sorteo.nombre = nombre;
        if (fecha) sorteo.fecha = fecha;

        await sorteo.save();
        res.json(sorteo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar parcialmente el sorteo" });
    }
};


exports.eliminarSorteos = async (req, res) => {
    try {
        const sorteo = await db.sorteo.findByPk(req.params.id);
        if (!sorteo)
            return res.status(404).json({ error: "Sorteo no encontrado" });

        if (sorteo.iniciado)
            return res.status(400).json({ error: "No se puede eliminar un sorteo iniciado" });

        await sorteo.destroy();
        res.json({ message: "Sorteo eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el sorteo" });
    }
};

exports.sortearSorteo = async (req, res) => {
    try {
        const sorteo = await db.sorteo.findByPk(req.params.id, {
            include: [{ model: db.participante, as: "participantes" }],
        });

        if (!sorteo)
            return res.status(404).json({ error: "Sorteo no encontrado" });

        if (sorteo.participantes.length < 2)
            return res.status(400).json({
                error: "Debe haber al menos dos participantes para sortear",
            });

        // Mezclar aleatoriamente los índices
        const participantes = sorteo.participantes;
        const indices = [...participantes.keys()];
        const mezclados = indices.sort(() => Math.random() - 0.5);

        // Asignar a cada uno su “amigo secreto”
        for (let i = 0; i < participantes.length; i++) {
            const siguiente = mezclados[(i + 1) % participantes.length];
            participantes[i].asignadoA = participantes[siguiente].id;
            await participantes[i].save();
        }

        sorteo.iniciado = true;
        await sorteo.save();

        res.json({
            message: "Sorteo realizado exitosamente",
            sorteoId: sorteo.id,
            linkAcceso: `/sorteos/${sorteo.hashAcceso}`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al sortear los participantes" });
    }
};