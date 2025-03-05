import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const isAuth = async (req, res, next) => {
  const token = req.cookies.token;

  // If no token, redirect to login
  if (!token) {
    return res.redirect("/loginpage");
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    // If user doesn't exist, redirect to login
    if (!user) {
      return res.redirect("/loginpage");
    }

    // Attach the user ID to the request object
    req.users = user.id;

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      res.clearCookie("token");
      return res.redirect("/loginpage");
    }

    return res.status(500).redirect("/loginpage");
  }
};
