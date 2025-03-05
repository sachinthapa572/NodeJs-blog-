import flash from "connect-flash";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { sessionOptions } from "./constant";
import authRoute from "./routes/auth.routes";
import blogRoute from "./routes/blog.routes";
import { jwtDecode } from "./utils/decodeJwtToken";
dotenv.config();

//! app creating
const app = express();

//! ejs lai setup
app.set("view engine", "ejs");

app.use(
  express.json({
    limit: "16kb",
    strict: true,
  }),
  express.urlencoded({ extended: true, limit: "16kb" }),
  cookieParser(),
  session(sessionOptions),
  cookieParser(),
  flash()
);

// setting the global variable
app.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    let decodedToken = await jwtDecode(token);
    if (decodedToken && decodedToken?.id) {
      res.locals.currentUserId = decodedToken?.id;
    }
  } else {
    res.locals.currentUserId = null;
  }
  res.locals.islogined = req.cookies.token || null;
  res.locals.error = req.flash("error") || null;
  next();
});

//! setting of the routes
app.use("", authRoute);
app.use("", blogRoute);

//!  static file ko lagi
app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/images"));
app.use(express.static("uploads/"));
app.use(express.static("node_modules/tinymce/"));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
