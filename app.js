const express = require('express');
const { blog, user } = require('./model/index');
const { where } = require('sequelize');
const bcrypt = require('bcrypt')

const { homePage, deletePost, addPost, singleBlog, createPost, editPost, updatePost, signupUser, loginPage, loginUser, signupPage } = require('./controller/blog/blogController');
const blogRoute = require('./routes/BlogRoute');
const app = express();
// handel the form data or handel the incomming json payload (bodyparser ko alternative)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ejs lai setup
app.set('view engine', 'ejs');


// setting of the routes
app.use('/', blogRoute);

//  static file ko lagi
app.use(express.static('public/css'));
app.use(express.static('public/images'));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// database connection
require('./model/index');
