const { blog, user } = require("../../model");


// Home page && read the database from the table
exports.homePage = async (req, res) => {
    const data = await blog.findAll();
    res.render('Blog', {
      data
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
      where:{
        id:id
      }
    })
    res.render('SingleBlog' , {
      data
    });
  
  }

// add the post in the database
exports.addPost= async (req, res) => {
    // console.log(req.body);
  
    const { title, subtitle, description } = req.body;
  
    blog.create({
      title,
      subtitle,
      description,
    });
  
    // res.send('sucess');
    res.redirect('/'); // redirect to the given page
  }

// delete the post
exports.deletePost = async (req , res ) => {

    const id = req.params.id; 
    console.log(id);
    await blog.destroy({
      where:{
        id:id
      }
    })
  
    res.redirect('/')
  }

//   edit post
exports.editPost = async (req,res)=> {
    const id = req.params.id
    const [data] = await blog.findAll({
     where:{
       id:id
     }
   })
    res.render("EditBlog" , {
     data
    })
 }

// update the post 
exports.updatePost = async (req,res)=> {
    const id  = req.params.id
    const { title, subtitle, description } = req.body;
  
    await blog.update({
      title,
      subtitle,
      description
    } , {
      where:{
        id:id
      }
    })
  
    res.redirect('/blog/'+id)
      
  }


//! User Authentication

// signup page 
exports.signupPage = (req,res)=> {
    res.render('signup') 
 }

// signup user data 
exports.signupUser = async (req, res) => {
    const { username, email, password } = req.body;
  
    
    if (!username || !email || !password || username.length < 2) {
        return res.render('signup', {
            error: "Please fill in all fields."
        });
    }
  
    try {
        // Hash the password
        let newpassword = await bcrypt.hash(password, 10);
  
        // Create new user
        await user.create({
            username,
            email,
            password: newpassword
        });
        res.render('login');
    } catch (error) {
    
        console.error('Error:', error);
        res.render('signup', {
            error: "An error occurred during registration. Please try again."
        });
    }
  }

// login page 

exports.loginPage = (req,res)=> {
    res.render('login') 
  }

// login user

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        // Find the user by email
        const userExist = await user.findOne({
            where: { email }
        });
  
        if (!userExist) {
            return res.render('login', {
                error: "User does not exist. Please sign up."
            });
        }
  
        // Validate password
        const validPassword = await bcrypt.compare(password, userExist.password);
        if (!validPassword) {
            return res.render('login', {
                error: "Invalid password. Please try again."
            });
        }
  
        // If login is successful, redirect to the homepage
        res.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        res.render('login', {
            error: "An unexpected error occurred. Please try again."
        });
    }
  }