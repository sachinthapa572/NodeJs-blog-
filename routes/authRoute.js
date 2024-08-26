const router = require('express').Router();
const { signupPage, signupUser, loginPage, loginUser, logoutUser, recoverPasswordPage, checkuser, handelOTP, changePasswordPage, changePassword } = require('../controller/auth/authController');


router.route('/signuppage').get(signupPage);
router.route('/signupuser').post(signupUser);
router.route('/loginpage').get(loginPage);
router.route('/loginuser').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/recover-password').get(recoverPasswordPage).post(checkuser)
router.route('/handel-otp/:id').post(handelOTP)
router.route('/changePassword/:id').get(changePasswordPage).post(changePassword)



module.exports = router;
