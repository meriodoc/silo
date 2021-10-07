import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listOrderMine } from "../actions/orderActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
//import _ from "lodash";

// Right before return Call OrderMineList(import useSelector from react-redux) and import useDispatch
// Define useEffect - import from react
// To get the list of orders - define redux action and reducer
// get error and loading from redux Store
// Get orderMineList from redux state
// From orderMineList I get loading error and orders
// In the return part - check loading first ?=true - show <loading box> ELSE show error using <messagbox>
// show error ELSE Show a table
// Table header = thead    table Row = tr
// map to convert each order to jsx
// set key to unique value .ORDER_DETAILS_FAIL
// isPaid is conditional If true then else show 'No'
// Details button
// Import props as a parameter for order history screen
export default function OrderHistoryScreen(props) {
  const orderMineList = useSelector((state) => state.orderMineList);
  const { loading, error, orders } = orderMineList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listOrderMine());
  }, [dispatch]);

  //console.log("--", orderMineList);
  // {!_.isEmpty(orderMineList) || _.isNil(orderMineList) || loading ?
  return (
    <div>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
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
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : "No"}
                </td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() => {
                      props.history.push(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
