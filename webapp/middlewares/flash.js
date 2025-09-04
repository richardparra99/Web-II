// middlewares/flash.js
module.exports = (req, res, next) => {
  res.locals.flash = req.session.flash; // disponible en las vistas
  delete req.session.flash;             // se borra tras leerlo (solo 1 vez)
  next();
};
