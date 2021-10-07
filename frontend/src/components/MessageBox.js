import React from "react";
//* Props is to be able to access the children of MessageBox*//
export default function MessageBox(props) {
  return (
    //* If the props exists- use it ELSE the default is info *//
    //* Show the props - children *//
    <div className={`alert alert-${props.variant || "info"}`}>
      {props.children}
    </div>
  );
}
