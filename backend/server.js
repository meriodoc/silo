import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config();

const app = express();
// Here i need to parse the body of the http request to avoid the error in Postman FOR signin
// by running this I run new middleware by parsing data in the body of the request to json
app.use(express.json());

//
app.use(express.urlencoded({ extended: true }));

// mongosh "mongodb+srv://silo.oml0z.mongodb.net/myFirstDatabase" --username meriodoc
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/silo", {
  // Use Parser to get rid of depricated warnings
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
});
// userRouter is the responder to the path
app.use("/api/uploads", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use((err, req, next, res) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
/* Make server running - listener */
app.listen(port, () => {
  //console.log(`Serve at http://127.0.0.1:${port}`);
  console.log(`Serve at http://localhost:${port}`);
});
