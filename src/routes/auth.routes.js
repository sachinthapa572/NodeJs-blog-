const router = require('express').Router();
const { signupPage, signupUser, loginPage, loginUser, logoutUser, recoverPasswordPage, checkuser, handelOTP, changePasswordPage, changePassword } = require('../controller/auth/auth.controller');
const catchError = require('../utils/catchError');


router.route('/signuppage').get(signupPage).post(catchError(signupUser));
router.route('/loginpage').get(loginPage).post(catchError(loginUser));
router.route('/logout').get(catchError(logoutUser));
router.route('/recover-password').get(catchError(recoverPasswordPage)).post(catchError(checkuser))
router.route('/handel-otp/:id').post(catchError(handelOTP))
router.route('/changePassword/:id').get(changePasswordPage).post(catchError(changePassword))

module.exports = router;


// catchError() is the alternative of the try catch block and more easier to use 