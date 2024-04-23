import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Our Website  !</h1> 
      <div>
        <Link to="/signup">
          <button>Signup</button>
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
