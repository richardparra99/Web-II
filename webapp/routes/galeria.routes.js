const express = require("express");
const { checkUser } = require("../middlewares/check-user.js");
const controlador = require("../controllers//galeria.controller.js");

module.exports = (app) => {
  const router = express.Router();

  router.get('/', checkUser, controlador.obtenerInicio);
  router.get('/upload', checkUser, controlador.mostrarFormularioSubida);
  router.post('/upload', checkUser, controlador.subirImagenes);   // ✅ sin Multer
  router.get('/media/:id', checkUser, controlador.servirFoto);

  // -------- Álbumes (HTML) --------
  // (Deja ambas como las tenías; al estar duplicadas, Express usará la 1ª que responda)
  router.get('/albums', checkUser, controlador.albumsIndex);
  router.get('/albums', checkUser, controlador.obtenerSoloAlbumes);

  // -------- Endpoints JSON (¡el ORDEN importa!) --------
  // NUEVO: lista simple de álbumes para llenar el combo del modal
  router.get('/albums/json', checkUser, controlador.albumsListJson);

  // Ya la tenías: fotos de un álbum concreto
  router.get('/albums/:id/json', checkUser, controlador.albumsJson);

  // -------- Crear y subir a álbum --------
  router.post('/albums', checkUser, controlador.albumsCreate);
  router.post('/albums/:id/photos', checkUser, controlador.subirImagenesAAlbum);

  // -------- Acciones sobre fotos --------
  router.post('/fotos/:id/album', checkUser, controlador.setPhotoAlbum);
  router.delete('/fotos/:id', checkUser, controlador.eliminarFoto);
  app.use("/galeria", router);
};
