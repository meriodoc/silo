import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import { isAdmin, isAuth } from "../utils.js";

let productRouter = express.Router();

// API to send list of products to frontend
// Slash will be added to end of /api/products in server.js = exactly the  Api that frontend send for us
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    let products = await Product.find({});
    res.send(products);
  })
);

// Api to populate products to Mongo Silo Database
productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});   To clear database and remove all products
    let createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);

// APi productdetails
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);
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
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    let product = new Product({
      name: "Sample Name" + Date.now(),
      image: "/images/3D_Laminate.PNG",
      price: 0,
      category: "Sample Category",
      brand: "Sample Brand",
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      description: "Sample description",
    });
    // Save the product after having created it above
    let createdProduct = await product.save();
    // Passing the created product to front end
    res.send({ message: "Product Created", product: createdProduct });
  })
);

// API for updating-  put - a product
productRouter.put(
  "/:id",
  // JK PROBLEM
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // JK Make let and see
    let productId = req.params.id;
    // Get product from database
    // JK Make let and see
    let product = await Product.findById(productId);
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
      let updatedProduct = await product.save();
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
    let product = await Product.findById(req.params.id);
    if (product) {
      let deleteProduct = await product.remove();
      res.send({ message: "Product Deleted", product: deleteProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
export default productRouter;
