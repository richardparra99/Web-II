const db = require("../models");
const { generateAuthToken } = require("../utils/text.utilities");

exports.crearParticipante = async (req, res) => {
    const { nombre, email, idSorteo } = req.body;

    try {
        const sorteo = await db.sorteo.findByPk(idSorteo);
        if (!sorteo)
            return res.status(404).json({ error: "Sorteo no encontrado" });

        if (sorteo.iniciado)
            return res.status(400).json({
                error: "No se pueden agregar participantes a un sorteo ya iniciado",
            });

        const hashAcceso = generateAuthToken(nombre + email);

        const participante = await db.participante.create({
            nombre,
            email,
            idSorteo,
            hashAcceso,
            identificado: false,
        });

        res.status(201).json(participante);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear participante" });
    }
};

exports.getParticipantesPorSorteo = async (req, res) => {
    try {
        const participantes = await db.participante.findAll({
            where: { idSorteo: req.params.idSorteo },
        });

        res.json(participantes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener participantes" });
    }
};

exports.getParticipantePorHash = async (req, res) => {
    try {
        const participante = await db.participante.findOne({
            where: { hashAcceso: req.params.hash },
            include: [{ model: db.sorteo, as: "sorteo" }],
        });

        if (!participante)
            return res.status(404).json({ error: "Link inválido o expirado" });

        participante.identificado = true;
        await participante.save();

        res.json({
            participante,
            message: "Acceso válido",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al validar el acceso del participante" });
    }
};


exports.actualizarWishlist = async (req, res) => {
    const { wishlist } = req.body;

    try {
        const participante = await db.participante.findOne({
            where: { hashAcceso: req.params.hash },
        });

        if (!participante)
            return res.status(404).json({ error: "Participante no encontrado" });

        participante.wishlist = wishlist;
        await participante.save();

        res.json({
            message: "Wishlist actualizada correctamente",
            participante,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la wishlist" });
    }
};