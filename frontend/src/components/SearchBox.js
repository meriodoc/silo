import React, { useState } from "react";

export default function SearchBox(props) {
  // hook for state - name that user enters in SearchBox
  let [name, setName] = useState("");
  let submitHandler = (e) => {
    e.preventDefault();
    // Redirect user to the search page
    props.history.push(`/search/name/${name}`);
  };
  return (
    <form className="search" onSubmit={submitHandler}>
      <div className="row">
        <input
          type="text"
          name="q"
          id="q"
          onChange={(e) => setName(e.target.value)}
        ></input>
        <button className="primary" type="submit">
          <i className="fa fa-search"></i>
        </button>
      </div>
    </form>
  );
}
