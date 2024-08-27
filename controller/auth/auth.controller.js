const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const { user } = require("../../model");
const sendEmail = require('../../utils/nodeMailer');
const { OTPlength } = require('../../constant');


// signup page 
exports.signupPage = (req, res) => {
    const error = req.flash('error')
    return res.render('signup', {
        error: error.length > 0 ? error : null
    })
}

// signup user data 
exports.signupUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username.length < 2) {
        return res
            .status(404)
            .render('signup', {
                error: "Please fill in all fields."
            });
    }
    try {
        // check if the email already exists or not 
        const [userExist] = await user.findAll({
            where: { email }
        });
        if (userExist) {
            req.flash('error', 'Email already exists.')
            return res.redirect('/signuppage')
        }
        let newpassword = await bcrypt.hash(password, 10);
        // Create new user
        await user.create({
            username,
            email,
            password: newpassword
        });
        // return res.render('login');
        req.flash('message', 'Registration successful. Please login.')
        res.redirect('/loginpage');
    } catch (error) {
        req.flash('error', 'An error occurred during registration. Please try again.')
        res.redirect('/signuppage');
    }
}

// login page 
exports.loginPage = (req, res) => {
    const error = req.flash('error')
    const message = req.flash('message')
    return res.render('login',
        {
            error: error.length > 0 ? error : null,
            message: message.length > 0 ? message : null
        }
    )
}

// login user

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(404)
            .send("Please provide both email and password.");
    }
    try {
        // Find the user by email
        const [userExist] = await user.findAll({
            where: { email }
        });
        if (!userExist) {
            req.flash('error', 'User does not exist.')
            return res.redirect('/loginpage')
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, userExist.password);
        if (!validPassword) {
            req.flash('error', 'Invalid password. Please try again.')
            return res.redirect('/loginpage')
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
        req.flash('message', 'Login successful.')
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'An unexpected error occurred. Please try again.')
        res.redirect('/loginpage')
    }
}

exports.logoutUser = (req, res) => {
    try {
        res.clearCookie('token')
        req.flash('message', 'Logged out successfully.')
        res.redirect('/')
    } catch (error) {
        req.flash('message', 'An error occurred while logging out.')
        res.redirect('/')

    }
}




//!  recover password section 
exports.recoverPasswordPage = (req, res) => {
    return res.render('auth/recoverPage', {
        error: null,
        isotp: false,
        email: null
    })
}

exports.checkuser = async (req, res) => {
    const email = req.body.email;
    console.log(email);
    if (!email) {
        console.log("Enter the mail to proceed ");
        return res.render('auth/recoverPage', {
            error: "Enter the email to proceed ",
            isotp: false,
            email: null
        })
    }

    const [userExist] = await user.findAll({
        where: {
            email: email
        }
    })

    if (!userExist) {
        console.log("User does not exist ");
        return res.render('auth/recoverPage', {
            error: "The user with that mail does not exit ",
            isotp: false,
            email: email
        })
    }


    const generatedOTP = otpGenerator.generate(OTPlength, // package bata generate gare ko 
        {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });

    console.log(generatedOTP);
    // return

    await sendEmail({
        email: email,
        subject: "NodeBlog : Reset the Password ",
        otp: generatedOTP
    })

    // update the otp and the otpGeneratedTime in the database
    userExist.otp = await bcrypt.hash(generatedOTP, 10);
    userExist.otpGeneratedTime = Date.now()
    await userExist.save();         // save the update to the database 

    return res.render(`auth/recoverPage`, {
        error: null,
        isotp: true,
        email: email
    })
}
exports.changePasswordPage = (req, res) => {
    const email = req.params.id
    const otp = req.query.otp
    return res.render('auth/changePassword', {
        email,
        otp
    })
}

exports.handelOTP = async (req, res) => {
    const generatedOTP = req.body.otp
    const email = String(req.params.id)
    if (!(generatedOTP || email))
        return res.
            status(400).
            send("Enter the email or the Otp")
    const [data] = await user.findAll({
        where: {
            email: email,
        }
    })
    const userExist = await bcrypt.compare(generatedOTP, data?.otp)

    console.log(userExist);
    if (!userExist) {
        console.log("doest match the code");
        res.send("The OTP does not match")
    } else {
        const currentTime = Date.now();
        const otpGeneratedTime = userExist.otpGeneratedTime

        // check if the otp has been expired or not
        if (currentTime - otpGeneratedTime > 2 * 60 * 1000) {
            console.log("OTP has been expired")
            return res.send("OTP has been expired")
        } else {
            console.log("OTP has been verified");
            // data.otp = null;
            // data.otpGeneratedTime = null;
            // await data.save();

            return res.redirect(`/changePassword/${email}?otp=${generatedOTP}`)
        }
    }
}




exports.changePassword = async (req, res) => {
    try {
        const email = req.params.id;
        const otp = req.query.otp;
        const { password, confirmPassword } = req.body;
        // Validate passwords
        if (!password || !confirmPassword) {
            return res.status(400).send("Please provide both password and confirmPassword.");
        }
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        // Find user by email 
        //! update garne yo user ko information mati nai chan tei bata pass hane no needd to query into the data base every time 
        const [data] = await user.findAll({ where: { email: email } });
        if (!data) {
            return res.status(404).send("User not found.");
        }

        const currentTime = Date.now();
        const otpGeneratedTime = data.otpGeneratedTime;

        // Check if OTP matches
        const isOtpValid = await bcrypt.compare(otp, data?.otp);
        if (!isOtpValid) {
            return res.status(400).send("Invalid OTP.");
        }

        // Check if OTP has expired
        if (currentTime - otpGeneratedTime > 2 * 60 * 1000) { // 2 minutes expiry
            return res.status(400).send("OTP has expired.");
        }

        // Hash the new password and save
        const newHashedPassword = await bcrypt.hash(password, 10);
        data.password = newHashedPassword;
        data.otp = null;
        data.otpGeneratedTime = null;
        await data.save();

        return res.redirect('/loginpage');
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).send("An error occurred while changing the password.");
    }
};