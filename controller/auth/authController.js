const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//! User Authentication

const { user } = require("../../model");

// signup page 
exports.signupPage = (req, res) => {
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

exports.loginPage = (req, res) => {
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
        // console.log(userExist.id);

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
        } else {

            //! setting of the  jWT token
            const token = jwt.sign({ id: userExist.id }, String(process.env.JWT_SECRET), {
                expiresIn: '15d'

            })


            //! this will set the cookie in the browser
            res.cookie('token', token, {
                // expires: new Date(Date.now() + 1 * 60 * 1000),
                expires: new Date(Date.now() + 3600000), // cookie will be removed after 1 hour
                httpOnly: true,
                secure: true
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

exports.logoutUser = (req, res) => {
    res.clearCookie('token')
    res.redirect('/loginpage')
}