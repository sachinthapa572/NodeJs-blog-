import { Router } from "express";
import {
  changePassword,
  changePasswordPage,
  checkuser,
  handelOTP,
  loginPage,
  loginUser,
  logoutUser,
  recoverPasswordPage,
  signupPage,
  signupUser,
} from "../controller/auth/auth.controller.js";
import catchError from "../utils/catchError.js";

const userRouter = Router();

userRouter.route("/signuppage").get(signupPage).post(catchError(signupUser));
userRouter.route("/loginpage").get(loginPage).post(catchError(loginUser));
userRouter.route("/logout").get(catchError(logoutUser));
userRouter
  .route("/recover-password")
  .get(catchError(recoverPasswordPage))
  .post(catchError(checkuser));
userRouter.route("/handel-otp/:id").post(catchError(handelOTP));
userRouter
  .route("/changePassword/:id")
  .get(changePasswordPage)
  .post(catchError(changePassword));

export default userRouter;
