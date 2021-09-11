import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";

const productRouter = express.Router();

// API to send list of products to frontend
// Slash will be added to end of /api/products in server.js = exactly the  Api that frontend send for us
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  })
);

// Api to populate products to Mongo Silo Database
productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});   To clear database and remove all products
    const createdProducts = await Product.insertMany(data.products);
    res.send({ createdProducts });
  })
);

// APi productdetails
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
export default productRouter;
