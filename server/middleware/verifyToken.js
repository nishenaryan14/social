import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res
        .status(403)
        .json({ error: "Access Denied: No token provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Ensure req.user contains user details

    // Debugging log
    console.log("Verified User:", req.user);

    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(500).json({ error: "Failed to authenticate token" });
  }
};
