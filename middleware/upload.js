const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear carpeta si no existe
const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ⚠️ VULNERABLE — usa el nombre original, permite shell.sh.png
    cb(null, file.originalname);
  }
});

// ⚠️ VULNERABLE — solo valida la extensión final, no el contenido real
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Wrapper que da permisos SUID + ejecutable al archivo subido
const uploadWithExec = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return next(err);
    if (req.file) {
      fs.chmodSync(req.file.path, '4755'); // SUID + ejecutable
    }
    next();
  });
};

module.exports = uploadWithExec;