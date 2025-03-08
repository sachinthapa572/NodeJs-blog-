import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { OTPlength } from "../../constant.js";
import sendEmail from "../../utils/nodeMailer.js";

const prisma = new PrismaClient();

// Helper function for handling errors and flash messages
const handleError = (res, redirectPath, errorMessage, messageType = "error") => {
  req.flash(messageType, errorMessage);
  return res.redirect(redirectPath);
};

// Signup page
export const signupPage = (req, res) => {
  const error = req.flash("error");
  return res.render("signup", { error: error.length > 0 ? error : null });
};

// Signup user
export const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validation   
    if (!username || !email || !password || username.length < 2) {
      return handleError(
        res,
        "/signuppage",
        "Please provide valid username, email, and password."
      );
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return handleError(res, "/signuppage", "Email already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    req.flash("message", "Registration successful. Please login.");
    res.redirect("/loginpage");
  } catch (error) {
    console.error("Signup error:", error);
    handleError(res, "/signuppage", "An error occurred during registration.");
  }
};

// Login page
export const loginPage = (req, res) => {
  const error = req.flash("error");
  const message = req.flash("message");
  return res.render("login", {
    error: error.length > 0 ? error : null,
    message: message.length > 0 ? message : null,
  });
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return handleError(res, "/loginpage", "Please provide both email and password.");
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return handleError(res, "/loginpage", "Invalid credentials.");
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return handleError(res, "/loginpage", "Invalid credentials.");
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    // Set cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 3600000), // 15 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    req.flash("message", "Login successful.");
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    handleError(res, "/loginpage", "An error occurred during login.");
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.clearCookie("token");
  req.flash("message", "Logged out successfully.");
  res.redirect("/");
};

// Password recovery page
export const recoverPasswordPage = (req, res) => {
  const message = req.flash("message");
  return res.render("auth/recoverPage", {
    error: null,
    isotp: false,
    email: null,
    message: message.length > 0 ? message : null,
  });
};

// Check user and send OTP
export const checkuser = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate input
    if (!email) return handleError(res, "/recover-password", "Please provide an email.");

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.render("auth/recoverPage", {
        error: "User with this email does not exist",
        isotp: false,
        email,
        message: null,
      });
    }

    // Generate OTP
    const generatedOTP = otpGenerator.generate(OTPlength, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Send email
    await sendEmail({
      email,
      subject: "Password Reset OTP",
      otp: generatedOTP,
    });

    // Hash and save OTP
    const hashedOTP = await bcrypt.hash(generatedOTP, 10);
    await prisma.user.update({
      where: { email },
      data: {
        otp: hashedOTP,
        otpGeneratedTime: Date.now(),
      },
    });

    return res.render("auth/recoverPage", {
      error: null,
      isotp: true,
      email,
      message: null,
    });
  } catch (error) {
    console.error("OTP send error:", error);
    handleError(res, "/recover-password", "Failed to send OTP. Please try again.");
  }
};

// Handle OTP verification
export const handelOTP = async (req, res) => {
  const { email } = req.params;
  const { otp } = req.body;

  try {
    if (!email || !otp) {
      return handleError(res, "/recover-password", "Invalid request.");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return handleError(res, "/recover-password", "User not found.");

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.otp || "");
    if (!isValidOTP) {
      return handleError(res, "/recover-password", "Invalid OTP.");
    }

    // Check expiration (2 minutes)
    if (Date.now() - user.otpGeneratedTime > 120000) {
      await prisma.user.update({
        where: { email },
        data: { otp: null, otpGeneratedTime: null },
      });
      return handleError(res, "/recover-password", "OTP has expired.");
    }

    res.redirect(`/changePassword/${email}?otp=${otp}`);
  } catch (error) {
    console.error("OTP verification error:", error);
    handleError(res, "/recover-password", "OTP verification failed.");
  }
};

// Change password page
export const changePasswordPage = (req, res) => {
  const { id: email } = req.params;
  const { otp } = req.query;
  return res.render("auth/changePassword", { email, otp });
};

// Handle password change
export const changePassword = async (req, res) => {
  const { email } = req.params;
  const { otp, password, confirmPassword } = req.body;

  try {
    // Validate inputs
    if (!password || !confirmPassword) {
      return handleError(
        res,
        `/changePassword/${email}?otp=${otp}`,
        "Please fill all fields."
      );
    }

    if (password !== confirmPassword) {
      return handleError(
        res,
        `/changePassword/${email}?otp=${otp}`,
        "Passwords do not match."
      );
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return handleError(res, "/recover-password", "User not found.");

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.otp || "");
    if (!isValidOTP) {
      return handleError(res, "/recover-password", "Invalid OTP.");
    }

    // Check expiration
    if (Date.now() - user.otpGeneratedTime > 120000) {
      await prisma.user.update({
        where: { email },
        data: { otp: null, otpGeneratedTime: null },
      });
      return handleError(res, "/recover-password", "OTP has expired.");
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpGeneratedTime: null,
      },
    });

    req.flash("message", "Password updated successfully. Please login.");
    res.redirect("/loginpage");
  } catch (error) {
    console.error("Password change error:", error);
    handleError(res, "/recover-password", "Failed to change password.");
  }
};
