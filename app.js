const express = require('express');
const { blog } = require('./model/index');
const app = express();

// ejs lai setup
app.set('view engine', 'ejs');

// handel the form data or handel the incomming json payload (bodyparser ko alternative)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  static file ko lagi
app.use(express.static('public/css'));

// read the database from the table
app.get('/', async (req, res) => {
  const data = await blog.findAll();
  

  res.render('Blog', {
    data
  });
  // res.send('Hello World');
});

app.get('/createblog', (req, res) => {
  res.render('createblog');
});

// add the post in the database
app.post('/addpost', async (req, res) => {
  console.log(req.body);

  const { title, subtitle, description } = req.body;

  blog.create({
    title,
    subtitle,
    description,
  });

  // res.send('sucess');
  res.redirect('/'); // redirect to the given page
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// database connection
require('./model/index');
