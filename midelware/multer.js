const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Tous les fichiers sont envoyés vers le répertoire "uploads"
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});

function fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
}

// Configuration de multer
const uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1000000 } // Limitez la taille des fichiers téléchargés à 1 Mo (1000000 bytes)
});

module.exports = uploadImage;
