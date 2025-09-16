const db = require("../models");
// para identificar para quien este logueado solo para ese usuario se subira la fotos
module.exports = async (req, res, next) => {
  try {
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
