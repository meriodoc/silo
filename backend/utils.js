import jwt from "jsonwebtoken";
import mg from "mailgun-js";

// This file is for some utility functions like generate jsonWebToken jwt
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
    },
    // JSON Web token key (Secret)- will encrypt my data and generate a token - Must be stored elsewhere .env file
    process.env.JWT_SECRET || "mysecretkey",
    {
      expiresIn: "1000d",
    }
  );
};
// Middleware to authenticate const [state, dispatch] = useReducer(reducer, initialState, init)
// Will get the Auth from headers of this request
// slice: 7th = Bearer xxxxxx ========> Bearer + space ==7 : So then If have the token number xxxxxx
// Then jwt has to decript the token (SECRET)
// Third parameter is a callback function
// decode === information about the user
// By calling next we pass req.user to the next middleware//
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(
      token,
      process.env.JWT_SECRET || "mysecretkey",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Token Invalid" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
// Admin middleware
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "invalid Admin token" });
  }
};
// Seller middleware
export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: "invalid Seller token" });
  }
};
// Seller OR Admin middleware
export const isSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Seller OR Admin token" });
  }
};

// Mailgun implementation

export const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

export const payOrderEmailTemplate = (order) => {
  return `<h1>Thank you for shopping at Silo.</h1>
  <p>
  Hi ${order.user.name},</p>
  <p> We have finished processing your order.</p>
  <h2> [Order ${order._id}] (${order.createdAt
    .toString()
    .substring(0, 10)})</h2>
  <table>
  <thead>
  <td><strong>Product</strong></td>
  <td><strong>Quantity</strong></td>
  <td><strong align="right">Price</strong></td>
  </thead>
  <tbody>
  ${order.orderItems
    .map(
      (item) => `
    <tr>
    <td>${item.name}</td>
    <td align="center">${item.qty}</td>
    <td align="right"> R${item.price.toFixed(2)}</td>
    </tr>
    `
    )
    .join("\n")}
  </tbody>
  <tfoot>
  <tr>
  <td colspan="2">Item Price:</td>
  <td align="right"> R${order.itemsPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Tax Price:</td>
  <td align="right"> R${order.taxPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Shipping Price:</td>
  <td align="right"> R${order.shippingPrice.toFixed(2)}</td>
  </tr>
  <tr>
  <td colspan="2">Total Price:</td>
  <td align="right"><strong> R${order.totalPrice.toFixed(2)}</strong></td>
  </tr>
  <tr>
  <td colspan="2">Payment Method:</td>
  <td align="right">${order.paymentMethod}</td>
  </tr>
  </table>
  <h2>Shipping Address</h2>
  <p>
  ${order.shippingAddress.fullName},<br/>
  ${order.shippingAddress.address},<br/>
  ${order.shippingAddress.city},<br/>
  ${order.shippingAddress.country},<br/>
  ${order.shippingAddress.postalCode}<br/>
  </p>
  <hr/>
  <p>
  Thank you for shopping with Silo.
  </p>
  `;
};
