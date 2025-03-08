// controllers/blogController.js
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Initialize Prisma client
const prisma = new PrismaClient();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Home page - Show top 10 blogs by views
export const homePage = async (req, res) => {
  try {
    const message = req.flash("message");
    const data = await prisma.blog.findMany({
      include: { user: true },
      orderBy: { views: "desc" },
      take: 10,
    });
    res.render("Blog", {
      data,
      message: message.length > 0 ? message : null,
    });
  } catch (error) {
    console.error("Error fetching homepage:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Render create blog page
export const createPost = (req, res) => {
  res.render("createblog");
};

// Single blog page with view increment
export const singleBlog = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const message = req.flash("message");

    const data = await prisma.blog.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: { user: true },
    });

    if (!data) {
      return res.status(404).send("Blog not found");
    }

    res.render("SingleBlog", {
      data,
      message: message.length > 0 ? message : null,
    });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Add new blog post
export const addPost = async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;
    const userId = req.users; // Adjust based on your auth middleware
    const image = req.file ? `http://localhost:3000/${req.file.filename}` : null;

    if (!title || !subtitle || !description || !image) {
      return res.status(400).send("Please provide all required fields");
    }

    await prisma.blog.create({
      data: {
        title,
        subtitle,
        description,
        image,
        userId,
      },
    });

    req.flash("message", "Post added successfully");
    res.redirect("/");
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Delete blog post
export const deletePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const blogData = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blogData) {
      return res.status(404).send("Blog not found");
    }

    if (blogData.image) {
      const imgPath = path.join(__dirname, "../../uploads", path.basename(blogData.image));
      await fs.promises
        .unlink(imgPath)
        .catch((err) => console.error("Error deleting image:", err));
    }

    await prisma.blog.delete({
      where: { id },
    });

    req.flash("message", "Post deleted successfully");
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Render edit post page
export const editPost = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await prisma.blog.findUnique({
      where: { id },
    });

    if (!data) {
      return res.status(404).send("Blog not found");
    }

    res.render("EditBlog", { data });
  } catch (error) {
    console.error("Error fetching edit post:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Update blog post
export const updatePost = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, subtitle, description } = req.body;

    const blogData = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blogData) {
      return res.status(404).send("Blog not found");
    }

    let image = blogData.image;
    if (req.file) {
      image = `http://localhost:3000/${req.file.filename}`;
      const oldImgPath = path.join(__dirname, "../../uploads", path.basename(blogData.image));
      await fs.promises
        .unlink(oldImgPath)
        .catch((err) => console.error("Error deleting old image:", err));
    }

    if (!title || !subtitle || !description) {
      return res.status(400).send("Please provide all required fields");
    }

    await prisma.blog.update({
      where: { id },
      data: { title, subtitle, description, image },
    });

    req.flash("message", "Post updated successfully");
    res.redirect(`/blog/${id}`);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Show user's blogs
export const showMyBlog = async (req, res) => {
  try {
    const userId = req.users; // Adjust based on your auth middleware
    const data = await prisma.blog.findMany({
      where: { userId },
      include: { user: true },
    });
    res.render("myBlog", { data });
  } catch (error) {
    console.error("Error fetching my blogs:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Search blogs
export const searchBlog = async (req, res) => {
  try {
    const { search } = req.body;
    const data = await prisma.blog.findMany({
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    res.render("searchBlog", { data });
  } catch (error) {
    console.error("Error searching blogs:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Cleanup Prisma client on process exit
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
