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
      expiresIn: "60d",
    }
  );
};
// Middleware to authenticate const [state, dispatch] = useReducer(reducer, initialState, init)
// Will get the Auth from headers of this request
// slice: 7th = Bearer xxxxxx ========> Bearer + space ==7 : So then If have the token number xxxxxx
// Then jwt has to decript the token (SECRET)
// Third parameter is a callback function
// decode === information about the user
// By calling next we pass req.user to the next middleware//
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "mysecretkey",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Token Invalid" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
// Admin middleware
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "invalid Admin token" });
  }
};
