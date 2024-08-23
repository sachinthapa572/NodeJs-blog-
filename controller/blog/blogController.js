const { blog } = require("../../model");


// Home page && read the database from the table
exports.homePage = async (req, res) => {
  const data = await blog.findAll();
  res.render('Blog', {
    data,
  });
}

// create blog page
exports.createPost = (req, res) => {
  res.render('createblog');
}

// single blog page
exports.singleBlog = async (req, res) => { // :id denote the dynamic data 
  console.log(req.params.id);   // to get the :id value 
  const id = req.params.id

  const [data] = await blog.findAll({
    where: {
      id: id
    }
  })
  res.render('SingleBlog', {
    data
  });

}

//! add the post in the database
exports.addPost = async (req, res) => {
  // console.log(req.body);
  // console.log(req.users);

  const { title, subtitle, description } = req.body;
  const userId = req.users


  blog.create({
    title,
    subtitle,
    description,
    userId
  });

  // res.send('sucess');
  res.redirect('/'); // redirect to the given page
}

// delete the post
exports.deletePost = async (req, res) => {

  const id = req.params.id;
  console.log(id);
  await blog.destroy({
    where: {
      id: id
    }
  })

  res.redirect('/')
}

//   edit post
exports.editPost = async (req, res) => {
  const id = req.params.id
  const [data] = await blog.findAll({
    where: {
      id: id
    }
  })
  res.render("EditBlog", {
    data
  })
}

// update the post 
exports.updatePost = async (req, res) => {
  const id = req.params.id
  const { title, subtitle, description } = req.body;

  await blog.update({
    title,
    subtitle,
    description
  }, {
    where: {
      id: id
    }
  })

  res.redirect('/blog/' + id)

}

