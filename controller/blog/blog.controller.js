const { blog, user } = require("../../model");
const fs = require('fs')


// Home page && read the database from the table
exports.homePage = async (req, res) => {
  const data = await blog.findAll({
    include: {
      model: user
    }
  });      // join the table to show the data of the other table
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
    },
    include: {
      model: user
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
  console.log(req.file);    // file haru req.body ma aauna so use req.file


  const { title, subtitle, description } = req.body;
  const userId = req.users          // isAuthmiddelware le pass gare ko value 
  const image = `http://localhost:3000/${req.file.filename}`

  //* flash use hanerw milauna parcha 
  if (!(title || subtitle || description || image)) {
    return res.send("Enter the all fied 💕")
  }


  blog.create({
    title,
    subtitle,
    description,
    userId,
    image
  });

  // res.send('sucess');
  res.redirect('/'); // redirect to the given page
}

// delete the post
exports.deletePost = async (req, res) => {

  const id = req.params.id;
  // console.log(id);
  const [blogData] = await blog.findAll({
    where: {
      id: id
    }
  })

  if (blogData) {
    const imgPath = blogData.image.slice(22)
    fs.unlink(`uploads/${imgPath}`, (err) => {
      if (err) throw err;
      console.log(`${imgPath} was deleted`);
    });
  }

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
  let image;

  // check if the image is send or not and then set the image value
  const [blogData] = await (blog.findAll({
    where: {
      id: id
    }
  }))
  if (req.file) {
    image = `http://localhost:3000/${req.file.filename}`
    const imgPath = blogData.image.slice(22)
    fs.unlink(`uploads/${imgPath}`, (err) => {
      if (err) throw err;
      console.log(`${imgPath} was deleted`);
    });
  } else {
    image = blogData.image
  }
  // console.log(req.file);
  //* flash use hanerw milauna parcha 
  if (!(title || subtitle || description)) {
    return res.send("Enter the all fied 💕")
  }


  await blog.update({
    title,
    subtitle,
    description,
    image
  }, {
    where: {
      id: id
    }
  })



  res.redirect('/blog/' + id)

}


exports.showMyBlog = async (req, res) => {
  const userId = req.users;
  // console.log(id);

  const data = await blog.findAll({
    where: {
      userId
    },
    include: {
      model: user
    }
  })
  console.log(data);

  res.render("myBlog", {
    data
  })

}


