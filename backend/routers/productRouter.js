import express from "express";
import expressAsyncHandler from "express-async-handler";
import data from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";

let productRouter = express.Router();

// API to send list of products to frontend
// Slash will be added to end of /api/products in server.js = exactly the  Api that frontend send for us
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    // Define PAGINATION: Items per page = pageSize
    // Can use same logic for orders or users
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;
    // If it does not exist then make the name to an empty string
    let name = req.query.name || "";
    // If it does not exist then make the category to an empty string
    let category = req.query.category || "";
    // If it does not exist then make the seller to an empty string
    let seller = req.query.seller || "";
    let order = req.query.order || "";

    let min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    let max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    let rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    // If  name exists then Filter = name otherwise empty string
    let nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    // If  seller exists then Filter = seller otherwise empty string
    let sellerFilter = seller ? { seller } : {};
    // If  category exists then Filter = categoryFilter otherwise empty string
    let categoryFilter = category ? { category } : {};

    let priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    let ratingFilter = rating ? { rating: { $gte: rating } } : {};
    let sortOrder =
      order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : { _id: -1 }; /* latest == {_id: -1*/

    const count = await Product.count({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
      //...sortOrder,
    });

    // ... will decontruct this and put only the field of sellerFilter NOt the object
    // Need to poulate seller object from user collection
    // 2 params = 1 object to be populated. 2 fields of this object(seller.name) AND seller.logo
    let products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate("seller", "seller.name seller.logo")
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// API for product Categories
productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    let categories = await Product.find().distinct("category");
    res.send(categories);
  })
);

// Api to populate products to Mongo Silo Database
productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    //await Product.remove({}); // To clear database and remove all products
    const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const products = data.products.map((product) => ({
        ...product,
        seller: seller._id,
      }));
      let createdProducts = await Product.insertMany(products);
      res.send({ createdProducts });
    } else {
      res
        .status(500)
        .send({ message: "No seller found. first run /api/users/seed" });
    }
  })
);

// APi productdetails
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id).populate(
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
    let product = new Product({
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
  isSellerOrAdmin,
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
      // Else - If product does not exists
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

// API to create a review - post= create a resource
productRouter.post(
  "/:id/reviews",
  // JK PROBLEM
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // JK Make let and see
    let productId = req.params.id;
    // Get product from database
    // JK Make let and see
    let product = await Product.findById(productId);
    // If product exists then fill data from frontend ie, name etc
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You have already reviewed this product" });
      }

      let review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      // Add this review to the Reviews Array - Push
      product.reviews.push(review);
      // After adding a new review to the product reviews
      // Update numReviews and Rating
      product.numReviews = product.reviews.length;
      // create and calculate the rating
      // a = accumulator  c = current item 0= default a value     / devived by product.reviews.length
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;

      //JK Make let and see -  Save product
      let updatedProduct = await product.save();

      // after updated product - Send this product to frontend
      // latest review is -1
      res.status(201).send({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
      // Else - If product does not exists
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
export default productRouter;
