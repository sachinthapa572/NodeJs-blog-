const router = require('express').Router();

const { homePage, deletePost, addPost, singleBlog, createPost, editPost, updatePost } = require('../controller/blog/blogController');
const { signupPage, signupUser, loginPage, loginUser } = require('../controller/auth/authController');

router.route('/').get(homePage);                        // home page
router.route('/createblog').get(createPost);            // create blog page
router.route('/addpost').post(addPost);                 // add the post in the database
router.route('/blog/:id').get(singleBlog);              // single blog page
router.route('/deletepost/:id').get(deletePost);   // delete the post
router.route('/editpost/:id').get(editPost);        // edit post
router.route('/updatepost/:id').post(updatePost);  // update the post

//! user routes

router.route('/signuppage').get(signupPage);
router.route('/signupuser').post(signupUser);
router.route('/loginpage').get(loginPage);
router.route('/loginuser').post(loginUser);




module.exports = router;