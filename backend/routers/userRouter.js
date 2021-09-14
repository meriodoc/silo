import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import data from "../data.js";
import User from "../models/userModel.js";
import { generateToken } from "../utils.js";

// to make the code modular - define multiple routes
const userRouter = express.Router();

// Route for seed api - mongoose is async hence  async
// Create users here
userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    //To remove all users
    //await User.remove({});
    // insertMany inserts an array into the User Collection
    const createdUsers = await User.insertMany(data.users);
    // I send back created users
    res.send({ createdUsers });
  })
);

// APi SignIn return/post signin data and generate a token to auth user for next request - http request Postman
// Ajax request to check user email in DB against the email inside of the body of this request
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Check password if user is correct
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          // JSON webtoken - need to use it to authenticate my request
          token: generateToken(user),
        });
        return;
      }
    }
    // If user does not exists or invalid user and password = unauthorized 401
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    // Create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      // Have to convert password to hashed password
      password: bcrypt.hashSync(req.body.password, 8),
    });
    // Call user dot save - Created a user that was saved and create a new user
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      // JSON webtoken - need to use it to authenticate my request
      token: generateToken(createdUser),
    });
  })
);

export default userRouter;
