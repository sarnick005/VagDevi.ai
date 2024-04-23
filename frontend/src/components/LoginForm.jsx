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
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen">
        <img
          src="https://source.unsplash.com/K4mSJ7kc0As/600x800"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Log in to your account
          </h1>
          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label
                className="block text-gray-700"
                htmlFor="email"
                placeholder="Enter Email Address"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                value={loginForm.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleChange}
                required
                placeholder="Enter Password"
                minLength="6" // Corrected to minLength
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
                focus:bg-white focus:outline-none"
              />
            </div>
            <div className="text-right mt-2">
              <a
                href="#"
                className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
              >
                Forgot Password?
              </a>
            </div>
            <br />
            <br />
            <button
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
              px-4 py-3 mt-6"
            >
              Login
            </button>
          </form>
          <hr className="my-6 border-gray-300 w-full" />
          <p className="mt-8">
            Need an account?{" "}
            <button
              className="text-blue-500 hover:text-blue-700 font-semibold"
              onClick={handleSignup}
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
