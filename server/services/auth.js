import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure this path is correct

// Function to generate JWT
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Adjust the expiration time as needed
  );
};
