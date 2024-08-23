const router = require('express').Router();

const { homePage, deletePost, addPost, singleBlog, createPost, editPost, updatePost } = require('../controller/blog/blogController');
const { signupPage, signupUser, loginPage, loginUser } = require('../controller/auth/authController');
const { isAuth } = require('../middelware/isAuth');

router.route('/').get(homePage);
router.route('/createblog').get(createPost);            // isAuth is the middelware
router.route('/addpost').post(isAuth, addPost);
router.route('/blog/:id').get(singleBlog);
router.route('/deletepost/:id').get(deletePost);
router.route('/editpost/:id').get(editPost);
router.route('/updatepost/:id').post(updatePost);

//! user routes

router.route('/signuppage').get(signupPage);
router.route('/signupuser').post(signupUser);
router.route('/loginpage').get(loginPage);
router.route('/loginuser').post(loginUser);




module.exports = router;