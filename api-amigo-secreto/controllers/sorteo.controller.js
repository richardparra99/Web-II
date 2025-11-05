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

        if (sorteo.iniciado)
            return res.status(400).json({ error: "El sorteo ya fue iniciado" });

        const participantes = sorteo.participantes;

        if (participantes.length < 2)
            return res.status(400).json({
                error: "Debe haber al menos dos participantes para sortear",
            });

        // 🔹 Mezclar los participantes aleatoriamente
        const mezclados = [...participantes].sort(() => Math.random() - 0.5);

        // 🔹 Asignar el siguiente participante como el “amigo secreto”
        for (let i = 0; i < mezclados.length; i++) {
            const actual = mezclados[i];
            const siguiente = mezclados[(i + 1) % mezclados.length];
            actual.asignadoA = siguiente.id;
            await actual.save();
        }

        sorteo.iniciado = true;
        await sorteo.save();

        res.json({
            message: "Sorteo realizado exitosamente",
            sorteoId: sorteo.id,
            totalParticipantes: participantes.length,
            linkAcceso: `/sorteo/${sorteo.hashAcceso}`, // 👈 agregado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al sortear los participantes" });
    }
};


exports.getResultadosSorteo = async (req, res) => {
    try {
        const sorteo = await db.sorteo.findByPk(req.params.id, {
            include: [
                {
                    model: db.participante,
                    as: "participantes",
                    attributes: ["id", "nombre", "email", "wishlist", "asignadoA"]
                }
            ],
        });

        if (!sorteo)
            return res.status(404).json({ error: "Sorteo no encontrado" });

        // Mapea los resultados legibles
        const resultados = sorteo.participantes.map(p => {
            const amigo = sorteo.participantes.find(a => a.id === p.asignadoA);
            return {
                nombre: p.nombre,
                regaloPara: amigo ? amigo.nombre : "—",
                wishlist: amigo ? amigo.wishlist : "—"
            };
        });

        res.json({
            sorteo: sorteo.nombre,
            resultados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener resultados del sorteo" });
    }
};


exports.getSorteoPorHash = async (req, res) => {
    try {
        const sorteo = await db.sorteo.findOne({
            where: { hashAcceso: req.params.hash },
            include: [{ model: db.participante, as: "participantes" }],
        });

        if (!sorteo)
            return res.status(404).json({ error: "Sorteo no encontrado o inválido" });

        if (!sorteo.iniciado)
            return res.status(400).json({ error: "El sorteo aún no ha sido iniciado" });

        res.json({
            id: sorteo.id,
            nombre: sorteo.nombre,
            participantes: sorteo.participantes,
        });
    } catch (error) {
        console.error("Error al obtener sorteo por hash:", error);
        res.status(500).json({ error: "Error al obtener sorteo" });
    }
};
