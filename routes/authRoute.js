const router = require('express').Router();
const { signupPage, signupUser, loginPage, loginUser, logoutUser, recoverPasswordPage } = require('../controller/auth/authController');


router.route('/signuppage').get(signupPage);
router.route('/signupuser').post(signupUser);
router.route('/loginpage').get(loginPage);
router.route('/loginuser').post(loginUser);
router.route('/logout').get(logoutUser);


module.exports = router;
