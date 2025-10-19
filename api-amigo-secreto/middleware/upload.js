// backend/middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.resolve(__dirname, "../../frontend/public/uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safe = String(file.originalname || "file")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "")
      .toLowerCase();
    cb(null, `${Date.now()}_${safe}`);
  },
});

const isImage = (m) => /^image\/(png|jpe?g|gif|webp)$/i.test(m);
const isMp3   = (m) => /^audio\/mpeg$/i.test(m);

const imageFilter = (req, file, cb) => {
  if (isImage(file.mimetype)) return cb(null, true);
  cb(new Error("Solo se permiten imágenes"));
};

const audioFilter = (req, file, cb) => {
  if (isMp3(file.mimetype)) return cb(null, true);
  cb(new Error("Solo se permiten audios MP3"));
};

// ====== Uploaders con límites distintos ======
const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 25 * 1024 * 1024 },
});

module.exports = { uploadImage, uploadAudio };
