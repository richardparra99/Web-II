const db = require("../models");
const { generateAuthToken } = require("../utils/text.utilities");

exports.crearParticipante = async (req, res) => {
    const { nombre, email, idSorteo, wishlist } = req.body;

    try {
        // ✅ Verificamos que el sorteo exista y sea del usuario logueado
        const sorteo = await db.sorteo.findOne({
            where: {
                id: idSorteo,
                idUsuario: req.user.id
            }
        });

        if (!sorteo) {
            return res.status(404).json({ error: "Sorteo no encontrado o no pertenece al usuario" });
        }

        if (sorteo.iniciado) {
            return res.status(400).json({
                error: "No se pueden agregar participantes a un sorteo ya iniciado"
            });
        }

        // ✅ Generamos hash único
        const hashAcceso = generateAuthToken(nombre + email);

        // ✅ Creamos el participante
        const participante = await db.participante.create({
            nombre,
            email,
            wishlist: wishlist || "",
            idSorteo,
            hashAcceso,
            identificado: false,
        });

        res.status(201).json(participante);
    } catch (error) {
        console.error("Error al crear participante:", error);
        res.status(500).json({ error: "Error al crear participante" });
    }
};

exports.getParticipantesPorSorteo = async (req, res) => {
    try {
        const participantes = await db.participante.findAll({
            where: { idSorteo: req.params.idSorteo },
            order: [["nombre", "ASC"]],
        });

        res.json(participantes);
    } catch (error) {
        console.error("Error al obtener participantes:", error);
        res.status(500).json({ error: "Error al obtener participantes" });
    }
};

exports.getParticipantePorHash = async (req, res) => {
    try {
        // 🔹 Buscamos al participante por su link secreto
        const participante = await db.participante.findOne({
            where: { hashAcceso: req.params.hash },
            include: [
                {
                    model: db.sorteo,
                    as: "sorteo",
                    include: [{ model: db.participante, as: "participantes" }]
                }
            ],
        });

        if (!participante) {
            return res.status(404).json({ error: "Link inválido o expirado" });
        }

        // 🔹 Marcamos que ya accedió
        if (!participante.identificado) {
            participante.identificado = true;
            await participante.save();
        }

        // 🔹 Buscamos al amigo secreto
        const amigo = participante.sorteo.participantes.find(
            (p) => p.id === participante.asignadoA
        );

        // 🔹 Construimos la respuesta final
        const respuesta = {
            nombre: participante.nombre,
            email: participante.email,
            wishlistPropia: participante.wishlist || "",
            sorteo: participante.sorteo.nombre,
            amigoSecreto: amigo
                ? {
                    nombre: amigo.nombre,
                    wishlist: amigo.wishlist || "",
                }
                : null,
        };

        res.json(respuesta);
    } catch (error) {
        console.error("Error al validar acceso del participante:", error);
        res.status(500).json({ error: "Error al obtener datos del participante" });
    }
};

exports.actualizarWishlist = async (req, res) => {
    const { wishlist } = req.body;

    try {
        const participante = await db.participante.findOne({
            where: { hashAcceso: req.params.hash },
        });

        if (!participante) {
            return res.status(404).json({ error: "Participante no encontrado" });
        }

        participante.wishlist = wishlist;
        await participante.save();

        res.json({
            message: "Wishlist actualizada correctamente",
            participante,
        });
    } catch (error) {
        console.error("Error al actualizar wishlist:", error);
        res.status(500).json({ error: "Error al actualizar la wishlist" });
    }
};


// ✅ Eliminar participante por ID
exports.eliminarParticipante = async (req, res) => {
    try {
        // Buscamos el participante
        const participante = await db.participante.findOne({
            where: { id: req.params.id },
            include: [{ model: db.sorteo, as: "sorteo" }]
        });

        // Verificamos existencia
        if (!participante) {
            return res.status(404).json({ error: "Participante no encontrado" });
        }

        // Verificamos que el sorteo pertenezca al usuario autenticado
        if (participante.sorteo.idUsuario !== req.user.id) {
            return res.status(403).json({ error: "No autorizado para eliminar este participante" });
        }

        // No permitir eliminar si el sorteo ya fue iniciado
        if (participante.sorteo.iniciado) {
            return res.status(400).json({
                error: "No se pueden eliminar participantes de un sorteo ya iniciado"
            });
        }

        await participante.destroy();

        res.json({ message: "Participante eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar participante:", error);
        res.status(500).json({ error: "Error al eliminar participante" });
    }
};
