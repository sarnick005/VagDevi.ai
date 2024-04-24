import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = ({ userId: propUserId }) => {
  const [profileData, setProfileData] = useState(null);
  const { userId: routeUserId } = useParams();
  const userId = propUserId || routeUserId;
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, accessToken]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error.response.data);
      setProfileData(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout", null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      localStorage.removeItem("access_token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.response.data);
    }
  };

  return (
    <aside className="bg-black text-white w-64 h-screen flex flex-col justify-between">
      <div className="p-4">
        <div className="text-xl font-bold">Sidebar</div>
      </div>
      <div className="p-4">
        <Link
          to="/login"
          onClick={handleLogout}
          className={`block px-4 py-2 my-2  hover:bg-gray-700 rounded ${
            location.pathname === "/login" ? "bg-gray-700 text-white" : ""
          }`}
        >
          Logout
        </Link>
        <Link
          to={`/profile/${userId}`}
          className={`block px-4 py-2 my-2  hover:bg-gray-700 rounded ${
            location.pathname === `/profile/${userId}`
              ? "bg-gray-700 text-white"
              : ""
          }`}
        >
          Profile
        </Link>
        <Link
          to={`/chats/${userId}`}
          className={`block px-4 py-2 my-2  hover:bg-gray-700 rounded ${
            location.pathname === `/chats/${userId}`
              ? "bg-gray-700 text-white"
              : ""
          }`}
        >
          Chats
        </Link>
        <Link
          to={`/chats/image/${userId}`}
          className={`block px-4 py-2 my-2 mb-4 hover:bg-gray-700 rounded ${
            location.pathname === `/chats/image/${userId}`
              ? "bg-gray-700 text-white"
              : ""
          }`}
        >
          Image to Text
        </Link>
      </div>
    </aside>
  );
};

export default Navbar;
