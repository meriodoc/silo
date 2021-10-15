import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { deleteOrder, listOrders } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
//import _ from "lodash";
import { ORDER_DELETE_RESET } from "../constants/orderConstants";

export default function OrderListScreen(props) {
  let { pageNumber = 1 } = useParams();
  // Then seller mode is true >=0
  const sellerMode = props.match.path.indexOf("/seller") >= 0;
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders, page, pages } = orderList;
  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  //const userSignin = useSelector((state) => state.userSignin);
  //const { userInfo } = userSignin;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(
      listOrders({ seller: sellerMode ? userInfo._id : "", pageNumber })
    );
  }, [dispatch, successDelete, sellerMode, userInfo._id, pageNumber]);
  const deleteHandler = (order) => {
    // Delete Handler
    if (window.confirm("Confirm Order delete!")) {
      dispatch(deleteOrder(order._id));
    }
  };
  return (
    <div>
      <h1 className="heading-lists">ORDERS</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>R {order.totalPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "No"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="small2"
                      onClick={() => {
                        props.history.push(`/order/${order._id}`);
                      }}
                    >
                      DETAILS
                    </button>
                    <button
                      type="button"
                      className="small2"
                      onClick={() => deleteHandler(order)}
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
                to={`/orderlist/pageNumber/${x + 1}`}
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
