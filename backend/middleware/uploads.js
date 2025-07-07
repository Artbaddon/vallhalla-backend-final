// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Crear carpeta si no existe
const uploadDir = path.resolve("data/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Almacenar archivo con nombre único
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Validar tipo de archivo permitido
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no permitido (solo imágenes o PDF)"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;