// sadai same huncha yei ho every time 

const multer = require('multer')

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file.mimetype); // file type 
        let allowedFileType = ['image/png', 'image/jpeg', 'image/jpg']
        //TODO : implement the file size limit 
        if (!allowedFileType.includes(file.mimetype)) {
            cb(new Error("only support the jpeg , jpg , png"))  // cb(error)  cb(a, b) == sucess
            return
        }
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    },
});


module.exports = {
    multer,
    storage
}