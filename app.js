const express = require('express');
const cookieParser = require('cookie-parser');
const blogRoute = require('./routes/BlogRoute');
require('dotenv').config();

//! app creating 
const app = express();

//! database connection
require('./model/index');


//! handel the form data or handel the incomming json payload (bodyparser ko alternative)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//! Use the cookie-parser middleware
app.use(cookieParser());

//! ejs lai setup
app.set('view engine', 'ejs');

//! setting of the routes
app.use('', blogRoute);  // localhost:3000/ + blogRoute
// app.use('/test', blogRoute);  // localhost:3000/test + blogRoute


//!  static file ko lagi
app.use(express.static('public/css'));
app.use(express.static('uploads/'));


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



