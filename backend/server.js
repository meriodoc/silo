import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";

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

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
/* Make server running - listener */
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});
