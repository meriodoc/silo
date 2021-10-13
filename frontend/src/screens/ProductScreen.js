import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createReview, detailsProduct } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Rating from "../components/Rating";
import _ from "lodash";
import { PRODUCT_REVIEW_CREATE_RESET } from "../constants/productConstants";

export default function ProductScreen(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const [qty, setQty] = useState(1);
  const productDetails = useSelector((state) => state.productDetails);
  let { loading, error, product } = productDetails;

  let userSignin = useSelector((state) => state.userSignin);
  let { userInfo } = userSignin;

  let productReviewCreate = useSelector((state) => state.productReviewCreate);
  let {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;

  let [rating, setRating] = useState(0);
  let [comment, setComment] = useState("");

  useEffect(() => {
    if (successReviewCreate) {
      window.alert("REVIEW SUBMITTED!");
      setRating("");
      setComment("");
      //dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
      // This outside the claus clears the message when rating more than once
    }
    dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    dispatch(detailsProduct(productId));
  }, [dispatch, productId, successReviewCreate]);
  const addToCartHandler = () => {
    props.history.push(`/cart/${productId}?qty=${qty}`);
  };
  let submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.name })
      );
    } else {
      alert("PLEASE RATE THIS PRODUCT AND COMMENT");
    }
  };
  return (
    <div>
      {_.isEmpty(product) || loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="nav-arrow">
            <Link to="/">
              {
                <img
                  className="arrow-left"
                  src="/images/icons/arwleftblue.png"
                  alt="back arrow"
                ></img>
              }
            </Link>
          </div>
          <div className="row top">
            <div className="card  col-2 ImageCentreLarge ">
              <img
                className="medium ImageCentreLarge"
                src={product.image}
                alt={product.name}
              ></img>
            </div>

            <div className="col-1  card card-body">
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li className="descript">
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </li>
                <li className="price">PRICE : R {product.price}</li>
                <li className="price">
                  DESCRIPTION:
                  <p className="descript">{product.description}</p>
                </li>
              </ul>
            </div>

            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    <h1>SUPPLIER </h1>
                    <h2>
                      <Link to={`/seller/${product.seller._id}`}>
                        {product.seller.seller.name}
                      </Link>
                    </h2>
                    <Rating
                      rating={product.seller.seller.rating}
                      numReviews={product.seller.seller.numReviews}
                    ></Rating>
                  </li>
                  <li>
                    <div className="row">
                      <div className="bold-blue">PRICE</div>
                      <div className="price">R {product.price}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="bold-blue">STATUS</div>
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="success"> - Available</span>
                        ) : (
                          <span className="danger"> - Not Available</span>
                        )}
                      </div>
                    </div>
                  </li>
                  {product.countInStock > 0 && (
                    <>
                      <li>
                        <div className="row">
                          <div className="bold-blue">QTY</div>
                          <div>
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </li>
                      <li>
                        <button
                          onClick={addToCartHandler}
                          className="primary-small"
                        >
                          ADD TO CART
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="card card-body">
            <h2 id="reviews">RATINGS / REVIEWS</h2>
            {product.reviews.length === 0 && (
              <MessageBox>NO REVIEWS!</MessageBox>
            )}
            <ul className="bold-blue">
              {product.reviews.map((review) => (
                <div>
                  <li key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating rating={review.rating} caption=" "></Rating>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </li>
                </div>
              ))}
              <li className="card card-body">
                {_.isEmpty && userInfo ? (
                  <form className="form" onSubmit={submitHandler}>
                    <div>
                      <h2 className="headingCentreLarge">
                        <strong>REVIEW PRODUCT</strong>
                      </h2>
                    </div>
                    <div>
                      <label htmlFor="rating">RATING</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1- Poor</option>
                        <option value="2">2- Fair</option>
                        <option value="3">3- Good</option>
                        <option value="4">4- Very Good</option>
                        <option value="5">5- Excellent</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="comment">COMMENT</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label />
                      <button className="primary-small" type="submit">
                        <strong>SUBMIT</strong>
                      </button>
                    </div>
                    <div>
                      {_.isEmpty && loadingReviewCreate && (
                        <LoadingBox></LoadingBox>
                      )}
                      {errorReviewCreate && (
                        <MessageBox variant="danger">
                          {errorReviewCreate}
                        </MessageBox>
                      )}
                    </div>
                  </form>
                ) : (
                  <MessageBox>
                    Please <Link to="/signin">Sign In</Link> to write a review
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
