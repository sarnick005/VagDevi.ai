import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        loginForm
      );
      console.log(response.data);
      const { access_token, userId } = response.data;
      localStorage.setItem("access_token", access_token);
      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error("Error logging in:", error.response.data);
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials");
      }
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginForm.email}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <br />
        <br />
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginForm.password}
            onChange={handleChange}
            required
          />
        </div>{" "}
        <br />
        <br />
        <button type="submit" style={{ backgroundColor: "#73eb85" }}>
          Login
        </button>
      </form>
      <br />
      <br />
      <button style={{ backgroundColor: "#78aafa" }} onClick={handleSignup}>
        Signup
      </button>
    </div>
  );
};

export default LoginForm;
