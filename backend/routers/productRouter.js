import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
//import User from '../models/userModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";

const productRouter = express.Router();

// API to send list of products to frontend
// Slash will be added to end of /api/products in server.js = exactly the  Api that frontend send for us
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // If it does not exist then make the name to an empty string
    const name = req.query.name || "";
    // If it does not exist then make the category to an empty string
    const category = req.query.category || "";
    // If it does not exist then make the seller to an empty string
    const seller = req.query.seller || "";
    const order = req.query.order || "";

    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    // If it name exists then Filter = name otherwise empty string
    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    // If it seller exists then Filter = seller otherwise empty string
    const sellerFilter = seller ? { seller } : {};
    // If it category exists then Filter = categoryFilter otherwise empty string
    const categoryFilter = category ? { category } : {};

    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: -1 }; /* latest == {_id: -1*/

    // ... will decontruct this and put only the field of sellerFilter NOt the object
    // Need to poulate seller object from user collection
    // 2 params = 1 object to be populated. 2 fields of this object(seller.name) AND seller.logo
    const products = await Product.find({
      ...nameFilter,
      ...sellerFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      ...sortOrder,
    })
      .populate("seller", "seller.name seller.logo")
      .sort(sortOrder);
    res.send(products);
  })
);

// API for product Categories
productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

// Api to populate products to Mongo Silo Database
productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    //await Product.remove({}); // To clear database and remove all products
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);

// APi productdetails
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "seller.name seller.logo seller.rating seller.numReviews"
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

// APi to create products as Admin User in backend = POST
// /= /api/products
productRouter.post(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: "Sample Name" + Date.now(),
      seller: req.user._id,
      image: "/images/3D_Laminate.jpg",
      price: 0,
      category: "Sample Category",
      brand: "Sample Brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "Sample description",
    });
    // Save the product after having created it above
    const createdProduct = await product.save();
    // Passing the created product to front end
    res.send({ message: "Product Created", product: createdProduct });
  })
);

// API for updating-  put - a product
productRouter.put(
  "/:id",
  // JK PROBLEM
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    // JK Make let and see
    const productId = req.params.id;
    // Get product from database
    // JK Make let and see
    const product = await Product.findById(productId);
    // If product exists then fill data from frontend ie, name etc
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      //JK Make let and see -  Save product
      const updatedProduct = await product.save();
      // after updated product - Send this product to frontend
      res.send({ message: "Product Updated", product: updatedProduct });
      // Else - If product does not exits
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: "Product Deleted", product: deleteProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
export default productRouter;
