const db = require("../models");

module.exports = async (req, res, next) => {
  try {
    // Si NO hay sesión o el email no es un string no vacío, no consultes a la BD
    if (!req.session || typeof req.session.userEmail !== "string" || !req.session.userEmail.trim()) {
      req.currentUser = null;
      res.locals.currentUser = null;
      return next();
    }

    const email = req.session.userEmail.trim();
    const user = await db.usuario.findOne({ where: { email } });

    req.currentUser = user || null;
    res.locals.currentUser = user || null;
    return next();
  } catch (err) {
    console.error("Middleware usuario-actual error:", err);
    return next(err);
  }
};
