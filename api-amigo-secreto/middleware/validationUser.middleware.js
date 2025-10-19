const db = require("../models/");

const validateUser = async (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!bearerToken.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = bearerToken.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const userToken = await db.authToken.findOne({ where: { token } });
    if (!userToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await db.usuario.findByPk(userToken.idUsuario);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
}

module.exports = validateUser;