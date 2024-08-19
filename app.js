const express = require('express');
const { blog } = require('./model/index');
const { where } = require('sequelize');

const app = express();

// ejs lai setup
app.set('view engine', 'ejs');

// handel the form data or handel the incomming json payload (bodyparser ko alternative)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  static file ko lagi
app.use(express.static('public/css'));
app.use(express.static('public/images'));

// Home page && read the database from the table
app.get('/', async (req, res) => {
  const data = await blog.findAll();
  res.render('Blog', {
    data
  });
});

// create blog page
app.get('/createblog', (req, res) => {
  res.render('createblog');
});

// single blog page
app.get('/blog/:id', async (req, res) => { // :id denote the dynamic data 
  console.log(req.params.id);   // to get the :id value 
  const id = req.params.id

  const [data] = await blog.findAll({
    where:{
      id:id
    }
  })
  res.render('SingleBlog' , {
    data
  });

});

// delete the post
app.get('/deletepost/:id' , async (req , res ) => {

  const id = req.params.id; 
  console.log(id);
  await blog.destroy({
    where:{
      id:id
    }
  })

  res.redirect('/')
})

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

// edit post 

app.get('/editpost/:id' ,async (req,res)=> {
   const id = req.params.id
   const [data] = await blog.findAll({
    where:{
      id:id
    }
  })
   res.render("EditBlog" , {
    data
   })
})

app.post('/updatepost/:id' ,async (req,res)=> {
  const id  = req.params.id
  // const { title, subtitle, description } = req.body;

  await blog.update(req.body , {
    where:{
      id:id
    }
  })

  res.redirect('/blog/'+id)
    
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// database connection
require('./model/index');
