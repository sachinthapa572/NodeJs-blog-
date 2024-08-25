const router = require('express').Router();
const { signupPage, signupUser, loginPage, loginUser, logoutUser, recoverPasswordPage, checkuser } = require('../controller/auth/authController');


router.route('/signuppage').get(signupPage);
router.route('/signupuser').post(signupUser);
router.route('/loginpage').get(loginPage);
router.route('/loginuser').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/recover-password').get(recoverPasswordPage).post(checkuser)
// .post(verifyOtp)


module.exports = router;
