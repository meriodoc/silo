import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
// Rename component to Component
export default function AdminRoute({ component: Component, ...rest }) {
  // Get user Info
  const userSignin = useSelector((state) => state.userSignin);
  // Get user info from this.state.
  const { userInfo } = userSignin;
  return (
    // ...rest  = rest parameters of the original route
    <Route
      {...rest}
      render={(props) =>
        // Added another condition for Admin = true
        userInfo && userInfo.isAdmin ? (
          // If userInfo ? = does exist=> Render Component
          <Component {...props}></Component>
        ) : (
          // Else redirect because user must be logged in
          <Redirect to="/signin" />
        )
      }
    ></Route>
  );
}
