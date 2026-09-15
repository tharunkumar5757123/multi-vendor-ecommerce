const multer = require("multer");
const path = require("path");
const fs = require("fs");

const productUploadDir = path.join(__dirname, "../../uploads/products");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(productUploadDir, { recursive: true });
    cb(null, productUploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
