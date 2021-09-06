import express, { application } from "express";
import data from "./data.js";

const app = express();

app.get("/api/products", (req, res) => {
  res.send(data.products);
});

/* Create Handler for this path*/
app.get("/", (req, res) => {
  res.send("Server is ready");
});

/* Make server running - listener */
app.listen(5000, () => {
  console.log("Serve at http://localhost:5000");
});
