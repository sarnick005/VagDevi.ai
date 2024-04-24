import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import flowerImg from "../assets/bird.jpg";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/signup",
        formData
      );
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error.response.data);
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen bg-black">
        <img
          src={flowerImg}
          alt=""
          className="w-full h-full object-cover grayscale"
        />
      </div>
      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Create Your Account
          </h1>
          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label
                className="block text-gray-700"
                htmlFor="username"
                placeholder="Full Name"
              >
                Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-black
                focus:bg-white focus:outline-none"
                placeholder="Enter Email"
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-black
                focus:bg-white focus:outline-none"
                placeholder="Enter Password"
              />
            </div>{" "}
            <button
              type="submit"
              className="w-full block bg-black hover:bg-gray-900 focus:bg-gray-900 text-white font-semibold rounded-lg
              px-4 py-3 mt-6"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-8">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-black hover:text-gray-900 font-semibold"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
