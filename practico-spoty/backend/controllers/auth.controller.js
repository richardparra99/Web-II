const db = require("../models/");
const sha1 = require('sha1');
const { generateAuthToken } = require("../utils/text.utilities");

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await db.usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }
        if (usuario.password !== sha1(password)) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }
        const authToken = generateAuthToken(usuario.email);
        const nuevoToken = await db.authToken.create({
            token: authToken,
            idUsuario: usuario.id
        });
        res.json({ token: nuevoToken.token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}
exports.register = async (req, res) => {
    const { email, password, nombreCompleto } = req.body;
    try {
        const existingUser = await db.usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        const hashedPassword = sha1(password);
        const nuevoUsuario = await db.usuario.create({
            email,
            password: hashedPassword,
            nombreCompleto
        });
        res.status(201).json(
            {
                id: nuevoUsuario.id,
                email: nuevoUsuario.email,
                nombreCompleto: nuevoUsuario.nombreCompleto
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}