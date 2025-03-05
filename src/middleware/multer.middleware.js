import multer from "multer";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let allowedFileType = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFileType.includes(file.mimetype)) {
      cb(new Error("only support the jpeg, jpg, png"));
      return;
    }
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export { multer, storage };
