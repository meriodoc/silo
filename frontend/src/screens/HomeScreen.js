import React, { useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
import { listTopSellers } from "../actions/userActions";
import { Link } from "react-router-dom";
import _ from "lodash";

export default function HomeScreen() {
  let dispatch = useDispatch();
  let productList = useSelector((state) => state.productList);
  let { loading, error, products } = productList;

  let userTopSellersList = useSelector((state) => state.userTopSellersList);
  let {
    loading: loadingSellers,
    error: errorSellers,
    users: sellers,
  } = userTopSellersList;

  //console.log(this.state);
  useEffect(() => {
    dispatch(listProducts({}));
    // Get list of top sellers
    dispatch(listTopSellers());
  }, [dispatch]);
  // Below worked for Homescreen image display
  // (_.isEmpty(products) && _.isEmpty(sellers)) || loading ? //

  // {_.isEmpty(products, loadingSellers) ?
  //console.log("--", productList);
  //console.log("--", userTopSellersList);

  // if (_.isEmpty(products) && _.isEmpty(sellers)) {
  //   return <p>Data is loading...</p>;
  // } else {
  return (
    <div>
      <h2>Top Sellers</h2>
      {(_.isEmpty(products) && _.isEmpty(sellers)) || loadingSellers ? (
        <LoadingBox></LoadingBox>
      ) : errorSellers ? (
        <MessageBox variant="danger">{errorSellers}</MessageBox>
      ) : (
        <>
          {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}
      <h2> Featured Products</h2>
      {(_.isEmpty(products) && _.isEmpty(sellers)) || loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
          <div className="row center">
            {products.map((product) => (
              <Product key={product._id} product={product}></Product>
            ))}
          </div>
        </>
      )}
    </div>
  );
  /*} */
}
