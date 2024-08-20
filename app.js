const express = require('express');
const { blog, user } = require('./model/index');
const { where } = require('sequelize');
const bcrypt = require('bcrypt')

const { homePage, deletePost, addPost, singleBlog, createPost, editPost, updatePost, signupUser, loginPage, loginUser, signupPage } = require('./controller/blog/blogController');
const blogRoute = require('./routes/BlogRoute');

const app = express();

// setting of the routes
app.use('/', blogRoute);

// ejs lai setup
app.set('view engine', 'ejs');

// handel the form data or handel the incomming json payload (bodyparser ko alternative)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  static file ko lagi
app.use(express.static('public/css'));
app.use(express.static('public/images'));




// // Home page && read the database from the table
// app.get('/',homePage);

// // create blog page
// app.get('/createblog',createPost);

// // single blog page
// app.get('/blog/:id',singleBlog);

// // add the post in the database
// app.post('/addpost',addPost);

// // delete the post
// app.get('/deletepost/:id' ,deletePost)


// // edit post 

// app.get('/editpost/:id' ,editPost)

// // update the post 
// app.post('/updatepost/:id' ,updatePost)

// // signup page 

// app.get('/signuppage',signupPage)

// // signup user data 
// app.post('/signupuser',signupUser );

// // login page
// app.get('/loginpage',loginPage)


// //login user 

// app.post('/loginuser',loginUser );


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// database connection
require('./model/index');
