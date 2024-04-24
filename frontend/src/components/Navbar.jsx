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
      <div className="p-4"></div>
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
          className={`block px-4 py-2 my-2 mb-6 hover:bg-gray-700 rounded ${
            location.pathname === `/chats/image/${userId}`
              ? "bg-gray-700 text-white"
              : ""
          }`}
        >
          Image to Text
        </Link>
        {/* Display username and email under "Image to Text" */}
        {profileData && profileData.profile_data && (
          <div className="mt-4 flex items-center mb-4">
            <div className="text-lg h-[25px] w-[25px] border border-white rounded-full flex items-center justify-center text-white">
              <span
                style={{ display: "inline-block", verticalAlign: "middle" }}
              >
                {profileData.profile_data.username[0]}
              </span>
            </div>
            <div className="ml-2">
              <p className="font-semibold">
                {profileData.profile_data.username}
              </p>
              <p className="text-gray-400">{profileData.profile_data.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Navbar;
