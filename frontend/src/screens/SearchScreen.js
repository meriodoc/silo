import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { listProducts } from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Product from "../components/Product";
import Rating from "../components/Rating";
import { prices, ratings } from "../utils";
import _ from "lodash";

export default function SearchScreen(props) {
  let {
    name = "all",
    category = "all",
    min = 0,
    max = 0,
    rating = 0,
    order = "latest",
    pageNumber = 1,
  } = useParams();
  let dispatch = useDispatch();
  let productList = useSelector((state) => state.productList);
  let { loading, error, products, page, pages } = productList;

  let productCategoryList = useSelector((state) => state.productCategoryList);
  let {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;
  useEffect(() => {
    dispatch(
      listProducts({
        pageNumber,
        name: name !== "all" ? name : "",
        category: category !== "all" ? category : "",
        min,
        max,
        rating,
        order,
      })
    );
  }, [category, dispatch, name, min, max, rating, order, pageNumber]);
  let getFilterUrl = (filter) => {
    let filterPage = filter.page || pageNumber;
    let filterCategory = filter.category || category;
    let filterName = filter.name || name;
    let filterRating = filter.rating || rating;
    let sortOrder = filter.order || order;
    let filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    let filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;

    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;
  };
  return (
    <div>
      <div className="row">
        {_.isEmpty(products) || loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>{products.length} RESULTS</div>
        )}
        <div>
          SORT BY{" "}
          <select
            value={order}
            onChange={(e) => {
              props.history.push(getFilterUrl({ order: e.target.value }));
            }}
          >
            <option value="latest">LATEST Products</option>
            <option value="lowest">PRICE: Low to High</option>
            <option value="highest">PRICE: High to Low</option>
            <option value="toprated">RATINGS - Customer reviews</option>
          </select>
        </div>
        <div className="row top">
          <div className="col-1">
            <h3>DEPARTMENT</h3>
            <div>
              {_.isEmpty(categories) || loadingCategories ? (
                <LoadingBox></LoadingBox>
              ) : errorCategories ? (
                <MessageBox variant="danger">{errorCategories}</MessageBox>
              ) : (
                <ul>
                  <li>
                    <Link
                      className={"all" === category ? "active" : ""}
                      to={getFilterUrl({ category: "all" })}
                    >
                      ANY
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        className={c === category ? "active" : ""}
                        to={getFilterUrl({ category: c })}
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>PRICE</h3>
              <ul>
                {prices.map((p) => (
                  <li key={p.name}>
                    <Link
                      to={getFilterUrl({ min: p.min, max: p.max })}
                      className={
                        `${p.min}-${p.max}` === `${min}-${max}` ? "active" : ""
                      }
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h3>RATINGS</h3>
            <ul>
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? "active" : ""}
                  >
                    <Rating caption={" & up"} rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-3">
          {_.isEmpty(products) || loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            /* <div>{products.length} Results</div> */
            <>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <div className="row center">
                {products.map((product) => (
                  <Product key={product._id} product={product}></Product>
                ))}
              </div>
              <div className=" row center pagination">
                {[...Array(pages).keys()].map((x) => (
                  <Link
                    className={x + 1 === page ? "active" : ""}
                    key={x + 1}
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    {x + 1}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
