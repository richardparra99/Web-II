const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Guardamos dentro del front para que se sirva con tu static actual
const uploadsDir = path.resolve(__dirname, "../../frontend/public/uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_").toLowerCase();
    cb(null, `${Date.now()}_${safe}`);
  },
});

// === Filtros ===

// Solo imágenes
function imageFilter(req, file, cb) {
  if (/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error("Solo se permiten imágenes"));
}

// Solo audios (ej: mp3, wav, etc.)
function audioFilter(req, file, cb) {
  if (
    file.mimetype === "audio/mpeg" ||
    file.mimetype === "audio/mp3" ||
    file.mimetype?.startsWith("audio/")
  ) {
    return cb(null, true);
  }
  cb(new Error("Solo se permiten archivos de audio (mp3, wav, etc.)"));
}

// === Middlewares ===
const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB para canciones
});

module.exports = { uploadImage, uploadAudio };
