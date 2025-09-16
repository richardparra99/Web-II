const express = require("express");
const { checkUser } = require("../middlewares/check-user.js");
const controlador = require("../controllers//galeria.controller.js");

module.exports = (app) => {
  const router = express.Router();

  router.get('/', checkUser, controlador.obtenerInicio);
  router.get('/upload', checkUser, controlador.mostrarFormularioSubida);
  router.post('/upload', checkUser, controlador.subirImagenes);
  router.get('/media/:id', checkUser, controlador.servirFoto);

  router.get('/albums', checkUser, controlador.albumsIndex);
  router.get('/albums', checkUser, controlador.obtenerSoloAlbumes);

  router.get('/albums/json', checkUser, controlador.albumsListJson);

  router.get('/albums/:id/json', checkUser, controlador.albumsJson);

  router.post('/albums', checkUser, controlador.albumsCreate);
  router.post('/albums/:id/photos', checkUser, controlador.subirImagenesAAlbum);

  router.post('/fotos/:id/album', checkUser, controlador.setPhotoAlbum);
  router.delete('/fotos/:id', checkUser, controlador.eliminarFoto);
  
  app.use("/galeria", router);
};
