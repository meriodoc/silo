import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAdmin, isAuth, isSellerOrAdmin } from "../utils.js";

const orderRouter = express.Router();
// Order.find({}) = empty = All orders
orderRouter.get(
  "/",
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    // If it does not exist then make the seller to an empty string
    const seller = req.query.seller || "";
    // If it seller exists then Filter = seller otherwise empty string
    const sellerFilter = seller ? { seller } : {};
    // Get name from collection user
    // populate in order model gets user field =- ref  = User
    const orders = await Order.find({ ...sellerFilter }).populate(
      "user",
      "name"
    );
    res.send(orders);
  })
);

// Backend API to return orders of current user = join
// await = real orders NOT a promise
orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    //const orders = await Order.find({}).populate("user", "name");
    res.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // Check if order contains order items or not = Validation error
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Cart is empty" });
    } else {
      const order = new Order({
        seller: req.body.orderItems[0].seller,
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        // To find the user and authenticate him,  I will define middleware to handle that in utils.js
        user: req.user._id,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: "New Order Created", order: createdOrder });
    }
  })
);
// API for getting details of an order
orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // req.params.id is the value that the user enters rigth after / as an id
    const order = await Order.findById(req.params.id);
    // Check if order exists or not
    if (order) {
      res.send(order); // If it exists - just send the order
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

// APi for Payments - put= Update the order resource
// isAuth = only logged in user can make a payment
orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // req.params.id is the value that the user enters rigth after / as an id
    const order = await Order.findById(req.params.id).populate(
      "user",
      "email name"
    );
    // Check if order exists or not
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      // payment result from paypal
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      // After changing the value of order it is time to save it.
      const updatedOrder = await order.save();
      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
// Delete Order API
orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // req.params.id is the value that the user enters rigth after / as an id
    const order = await Order.findById(req.params.id);
    // Check if order exists or not
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: "Order Deleted", order: deleteOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
// APi for Delivery - put= Update the order resource
// isAuth = only logged in user can make a payment
orderRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    // req.params.id is the value that the user enters rigth after / as an id
    const order = await Order.findById(req.params.id);
    // Check if order exists or not
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      // After changing the value of order it is time to save it.
      const updatedOrder = await order.save();
      res.send({ message: "Order Delivered", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
export default orderRouter;
