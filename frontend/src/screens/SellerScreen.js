import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser } from "../actions/userActions";
import { listProducts } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Rating from "../components/Rating";
import Product from "../components/Product";
import _ from "lodash";

export default function SellerScreen(props) {
  // sellerId comes from the URL - use colon id for a place holder
  let sellerId = props.match.params.id;
  // Get data from redux store
  let userDetails = useSelector((state) => state.userDetails);
  // From user details object EXTRACT loading, error and user
  let { loading, error, user } = userDetails;

  // Get data of products of current Seller //

  // Get data from redux store
  let productList = useSelector((state) => state.productList);
  // From user productlist object EXTRACT loading, error and user
  let {
    loading: loadingProducts,
    error: errorProducts,
    products,
  } = productList;

  let dispatch = useDispatch();
  useEffect(() => {
    // get details of current user
    dispatch(detailsUser(sellerId));
    // Get products of the current seller
    dispatch(listProducts({ seller: sellerId }));
    // When there is a change in sellerId the above two lines runs again = function
  }, [dispatch, sellerId]);
  return (
    <div className="row top">
      <div className="col-1">
        {_.isEmpty(products) || loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <ul className="card card-body">
            <li>
              <div className="row start">
                <div className="p-1">
                  <img
                    className="small"
                    src={user.seller.logo}
                    alt={user.seller.name}
                  ></img>
                </div>
                <div className="p-1">
                  <h1>{user.seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating
                rating={user.seller.rating}
                numReviews={user.seller.numReviews}
              ></Rating>
            </li>
            <li>
              <a href={`mailto:${user.email}`}>Contact Seller</a>
            </li>
            <li>{user.seller.description}</li>
          </ul>
        )}
      </div>
      <div className="col-3">
        {_.isEmpty(products) || loadingProducts ? (
          <LoadingBox></LoadingBox>
        ) : errorProducts ? (
          <MessageBox variant="danger">{errorProducts}</MessageBox>
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
    </div>
  );
}
