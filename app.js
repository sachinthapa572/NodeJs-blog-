const express = require('express');
const cookieParser = require('cookie-parser');
const blogRoute = require('./routes/BlogRoute');
const authRoute = require('./routes/authRoute');
require('dotenv').config();

//! app creating 
const app = express();

//! ejs lai setup
app.set('view engine', 'ejs');

//! database connection
require('./model/index');


//! handel the form data or handel the incomming json payload (bodyparser ko alternative)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Use the cookie-parser middleware
app.use(cookieParser());

// setting the global variable
app.use((req, res, next) => {
  res.locals.islogined = req.cookies.token || null
  next()

})

//! setting of the routes
app.use('', blogRoute);  // localhost:3000/ + blogRoute
// app.use('/test', blogRoute);  // localhost:3000/test + blogRoute
app.use('', authRoute)


//!  static file ko lagi
app.use(express.static('public/css'));
app.use(express.static('public/images'));
app.use(express.static('uploads/'));
app.use(express.static('node_modules/tinymce/'));



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// app.use() is the express middelware that run every time in the action
// res.locals set the global variable so that it can be access from any where



