const router = require('express').Router();
const { homePage, deletePost, addPost, singleBlog, createPost, editPost, updatePost, showMyBlog, testshow, uploads } = require('../controller/blog/blog.controller');
const { isAuth } = require('../middleware/isAuth.middleware');
const catchError = require('../utils/catchError');
// multer  config 
const { multer, storage } = require('../middleware/multer.middleware');
const upload = multer({ storage: storage })


router.route('/').get(catchError(homePage));
router.route('/createblog')
    .get(isAuth, catchError(createPost))
    .post(isAuth, upload.single("image"), catchError(addPost));
router.route('/blog/:id').get(singleBlog);
router.route('/deletepost/:id').get(isAuth, catchError(deletePost));
router.route('/editpost/:id').get(isAuth, catchError(editPost));
router.route('/updatepost/:id').post(isAuth, upload.single('image'), catchError(updatePost));
router.route('/myBlog').get(isAuth, showMyBlog);


module.exports = router;