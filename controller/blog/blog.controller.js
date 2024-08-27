const { blog, user } = require("../../model");
const fs = require('fs')


// Home page && read the database from the table
exports.homePage = async (req, res) => {
  const message = req.flash('message')
  const data = await blog.findAll({
    include: {          // join the table to show the data of the other table
      model: user
    }
  });
  res.render('Blog', {
    data,
    message: message.length > 0 ? message : null
  });
}

// create blog page
exports.createPost = (req, res) => {
  res.render('createblog');
}

// single blog page
exports.singleBlog = async (req, res) => {            // :id denote the dynamic data  
  const id = req.params.id          // get the id from the url
  const message = req.flash('message')
  const [data] = await blog.findAll({
    where: {
      id: id
    },
    include: {
      model: user
    }
  })
  res.render('SingleBlog', {
    data,
    message: message.length > 0 ? message : null
  });

}

//! add the post in the database
exports.addPost = async (req, res) => {
  // console.log(req.file);    // file haru req.body ma aauna so use req.file
  const { title, subtitle, description } = req.body;
  const userId = req?.users          // isAuthmiddelware le pass gare ko value 
  const image = `http://localhost:3000/${req?.file?.filename}`

  //* flash use hanerw milauna parcha 
  if (!(title || subtitle || description || image)) {
    return res.
      status(400)
      .send("Enter the all fied 💕")
  }

  try {
    blog.create({
      title,
      subtitle,
      description,
      userId,
      image
    });

    req.flash('message', 'Post added successfully')
    res.redirect('/'); // redirect to the given page
  } catch (error) {
    console.log(error);
    res.send("Error in the server")
  }
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
    const imgPath = blogData?.image?.slice(22)
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

  req.flash('message', 'Post deleted successfully')
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
  req.flash('message', 'Post updated successfully')
  res.redirect('/blog/' + id)

}


exports.showMyBlog = async (req, res) => {
  const userId = req.users;
  const data = await blog.findAll({
    where: {
      userId
    },
    include: {
      model: user
    }
  })
  res.render("myBlog", {
    data
  })

}


