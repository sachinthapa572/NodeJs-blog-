import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
const prisma = new PrismaClient();

// Helper functions
const handleFileDelete = async (imagePath) => {
  try {
    if (imagePath) {
      const filename = imagePath.split("/").pop();
      await fs.unlink(`uploads/${filename}`);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

const validateBlogPost = (fields) => {
  const { title, subtitle, description } = fields;
  if (!title || !subtitle || !description) {
    throw new Error("All fields are required");
  }
};

// Home page
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
    console.error("Home page error:", error);
    req.flash("error", "Error loading blog posts");
    res.redirect("/");
  }
};

// Single blog page
export const singleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const message = req.flash("message");

    const blogPost = await prisma.blog.update({
      where: { id: Number(id) },
      data: { views: { increment: 1 } },
      include: { user: true },
    });

    res.render("SingleBlog", {
      data: blogPost,
      message: message.length > 0 ? message : null,
    });
  } catch (error) {
    console.error("Single blog error:", error);
    req.flash("error", "Blog post not found");
    res.redirect("/");
  }
};

// Add new post
export const addPost = async (req, res) => {
  try {
    const { title, subtitle, description } = req.body;
    const userId = req.users;
    const image = req.file ? `http://localhost:3000/${req.file.filename}` : null;

    validateBlogPost({ title, subtitle, description });

    await prisma.blog.create({
      data: {
        title,
        subtitle,
        description,
        userId,
        image,
      },
    });

    req.flash("message", "Post added successfully");
    res.redirect("/");
  } catch (error) {
    console.error("Add post error:", error);
    req.flash("error", error.message);
    res.redirect("/create-post");
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await prisma.blog.delete({
      where: { id: Number(id) },
    });

    await handleFileDelete(blogPost.image);

    req.flash("message", "Post deleted successfully");
    res.redirect("/");
  } catch (error) {
    console.error("Delete post error:", error);
    req.flash("error", "Error deleting post");
    res.redirect("/");
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description } = req.body;
    let image;

    validateBlogPost({ title, subtitle, description });

    const existingPost = await prisma.blog.findUnique({
      where: { id: Number(id) },
    });

    if (req.file) {
      image = `http://localhost:3000/${req.file.filename}`;
      await handleFileDelete(existingPost.image);
    }

    const updatedPost = await prisma.blog.update({
      where: { id: Number(id) },
      data: {
        title,
        subtitle,
        description,
        image: image || existingPost.image,
      },
    });

    req.flash("message", "Post updated successfully");
    res.redirect(`/blog/${id}`);
  } catch (error) {
    console.error("Update post error:", error);
    req.flash("error", error.message);
    res.redirect(`/edit-post/${id}`);
  }
};

// Show user's blogs
export const showMyBlog = async (req, res) => {
  try {
    const data = await prisma.blog.findMany({
      where: { userId: req.users },
      include: { user: true },
    });

    res.render("myBlog", { data });
  } catch (error) {
    console.error("My blogs error:", error);
    req.flash("error", "Error loading your blogs");
    res.redirect("/");
  }
};

// Search blogs
export const searchBlog = async (req, res) => {
  try {
    const { search } = req.body;
    const data = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    res.render("searchBlog", { data });
  } catch (error) {
    console.error("Search error:", error);
    req.flash("error", "Search failed");
    res.redirect("/");
  }
};
