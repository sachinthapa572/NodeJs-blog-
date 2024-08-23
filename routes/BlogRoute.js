const router = require('express').Router();
const { homePage, deletePost, addPost, singleBlog, createPost, editPost, updatePost, showMyBlog } = require('../controller/blog/blogController');
const { isAuth } = require('../middleware/isAuth.middleware');
// multer  config 
const { multer, storage } = require('../middleware/multer.middleware')
const upload = multer({ storage: storage })


router.route('/').get(homePage);
router.route('/createblog').get(isAuth, createPost);            // isAuth is the middelware
router.route('/addpost').post(isAuth, upload.single("image"), addPost);
router.route('/blog/:id').get(singleBlog);
router.route('/deletepost/:id').get(isAuth, deletePost);
router.route('/editpost/:id').get(isAuth, editPost);
router.route('/updatepost/:id').post(isAuth, upload.single('image'), updatePost);
router.route('/myBlog').get(isAuth, showMyBlog);

module.exports = router;