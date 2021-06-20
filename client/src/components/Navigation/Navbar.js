import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="Navbar-container">
      <NavLink
        exact to="/"
        activeClassName="navbar-link-active"
        className="navbar-link"
      >
        <div>All Interviews</div>
      </NavLink>

      <NavLink
        activeClassName="navbar-link-active"
        exact to="/create"
        className="navbar-link"
      >
        <div>Create Interview</div>
      </NavLink>
    </div>
  );
}

export default Navbar;
