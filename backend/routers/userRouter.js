import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import data from "../data.js";
import User from "../models/userModel.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";
//import { updateUserProfile } from "../../frontend/src/actions/userActions.js";

// to make the code modular - define multiple routes
let userRouter = express.Router();

// APi for top Sellers -1 = descending
userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (req, res) => {
    let topSellers = await User.find({ isSeller: true })
      .sort({ "seller.rating": -1 })
      .limit(2);
    res.send(topSellers);
  })
);

// Route for seed api - mongoose is async hence  async
// Create users here
userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    //To remove all users
    //await User.remove({});
    // insertMany inserts an array into the User Collection
    let createdUsers = await User.insertMany(data.users);
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
          isSeller: user.isSeller,
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
      isSeller: user.isSeller,
      // JSON webtoken - need to use it to authenticate my request
      token: generateToken(createdUser),
    });
  })
);

// API for user information - Profile Screen
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

// API for update user info Update - Profile Screen
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      // Use pipe - user.name -  to guard against empty string - user didn't enter anything- Then use previous name in db
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        // Check if user.seller.name exists || if not = use the current name = user.seller.name
        user.seller.name = req.body.sellerName || user.seller.name;
        // Check if user.seller.logo exists || if not = use the current logo = user.seller.logo
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        // Check if user.seller.description exists || if not = use the current description = user.seller.description
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      // For password - check if it has been passed
      if (req.body.password) {
        // If so then encrypt password - use 8 to generate the auto salt
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      // Save user info
      const updatedUser = await user.save();
      // send userInfo to frontend
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);

// API for returning/list users from the users collection Prefix: / = /api/users
// find({}) = empty object will return all users
userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

// API to delete a user //
userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@1cloudsilo.com") {
        res.status(400).send({ message: "CAN NOT DELETE ADMIN USER" });
        // return won't run next lines
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: "User Deleted", user: deleteUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

// API for edit user info
userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      // Use pipe - user.name -  to guard against empty string - user didn't enter anything- Then use previous name in db
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      // user.isSeller = req.body.isSeller || user.isSeller;
      // user.isAdmin = req.body.isAdmin || user.isAdmin;
      user.isSeller = Boolean(req.body.isSeller);
      user.isAdmin = Boolean(req.body.isAdmin);
      // Udate the boolean fields
      // Save user info
      const updatedUser = await user.save();

      // send userInfo to frontend
      res.send({
        message: "User Updated",
        user: updatedUser,
      });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default userRouter;
