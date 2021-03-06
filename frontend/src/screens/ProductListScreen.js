import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  deleteProduct,
  listProducts,
} from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from "../constants/productConstants";
import _ from "lodash";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export default function ProductListScreen(props) {
  let { pageNumber = 1 } = useParams();

  // Then seller mode is true >=0
  let sellerMode = props.match.path.indexOf("/seller") >= 0;
  let productList = useSelector((state) => state.productList);
  let { loading, error, products, page, pages } = productList;
  // Get data from productCreate in redux store
  let productCreate = useSelector((state) => state.productCreate);
  // Rename them all below
  let {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;
  let productDelete = useSelector((state) => state.productDelete);
  let {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;
  let userSignin = useSelector((state) => state.userSignin);
  let { userInfo } = userSignin;
  let dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      // redirect user to the edit screen for the created product
      props.history.push(`/product/${createdProduct._id}/edit`);
    }
    if (successDelete) {
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
    dispatch(
      listProducts({ seller: sellerMode ? userInfo._id : "", pageNumber })
    );
  }, [
    createdProduct,
    dispatch,
    props.history,
    sellerMode,
    successCreate,
    successDelete,
    userInfo._id,
    pageNumber,
  ]);

  const deleteHandler = (product) => {
    if (window.confirm("Confirm to delete product")) {
      // Dispatch delete action here
      dispatch(deleteProduct(product._id));
    }
  };
  const createHandler = () => {
    dispatch(createProduct());
  };
  //  {_.isEmpty(products, loading) ? (
  return (
    <div>
      <div className="heading-lists">
        <h1 className=" col-custom heading-lists"> MY PRODUCTS</h1>
      </div>
      <div className="heading-button">
        <button type="button" className="primary " onClick={createHandler}>
          CREATE PRODUCT
        </button>
      </div>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {_.isEmpty(products) || loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        /*Case 3 - If there is no loading and no error - Show Products */
        <>
          <table className="table">
            <thead>
              <tr className="table-custom">
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody className="table-custom">
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>R {product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <button
                      type="button"
                      className="small2"
                      onClick={() =>
                        props.history.push(`/product/${product._id}/edit`)
                      }
                    >
                      CHANGE
                    </button>
                    <button
                      type="button"
                      className="small2"
                      onClick={() => deleteHandler(product)}
                    >
                      DELETE&nbsp;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className=" row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? "active" : ""}
                key={x + 1}
                to={`/productlist/pageNumber/${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
