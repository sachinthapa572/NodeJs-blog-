import { Router } from "express";
import {
  addPost,
  createPost,
  deletePost,
  editPost,
  homePage,
  showMyBlog,
  singleBlog,
  updatePost,
} from "../controller/blog/blog.controller.js";
import { isAuth } from "../middleware/isAuth.middleware.js";
import { multer, storage } from "../middleware/multer.middleware.js";
import catchError from "../utils/catchError.js";

const blogRouter = Router();
const upload = multer({ storage: storage });

blogRouter.route("/").get(catchError(homePage));
blogRouter
  .route("/createblog")
  .get(isAuth, catchError(createPost))
  .post(isAuth, upload.single("image"), catchError(addPost));
blogRouter.route("/blog/:id").get(singleBlog);
blogRouter.route("/deletepost/:id").get(isAuth, catchError(deletePost));
blogRouter.route("/editpost/:id").get(isAuth, catchError(editPost));
blogRouter
  .route("/updatepost/:id")
  .post(isAuth, upload.single("image"), catchError(updatePost));
blogRouter.route("/myBlog").get(isAuth, showMyBlog);

export default blogRouter;
