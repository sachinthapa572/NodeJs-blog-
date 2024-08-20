const router = require('express').Router();

const { homePage, deletePost, addPost, singleBlog, createPost, editPost, updatePost, signupUser, loginPage, loginUser, signupPage } = require('../controller/blog/blogController');

router.route('/').get(homePage);
router.route('/createblog').get(createPost);
router.route('/addpost').post(addPost);
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