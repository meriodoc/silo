import jwt from "jsonwebtoken";
// This file is for some utility functions like generate jsonWebToken jwt
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    // JSON Web token key (Secret)- will encrypt my data and generate a token - Must be stored elsewhere .env file
    process.env.JWT_SECRET || "mysecretkey",
    {
      expiresIn: "30d",
    }
  );
};
