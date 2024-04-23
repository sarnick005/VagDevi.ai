import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar = ({ userId: propUserId }) => {
  const [profileData, setProfileData] = useState(null);
  const { userId: routeUserId } = useParams();
  const userId = propUserId || routeUserId; 
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

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

  const handleChats = () => {
    navigate(`/chats/${userId}`);
  };

  const redirectToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const handleImgToText = () => {
    navigate(`/chats/image/${userId}`);
  };

  return (
    <div>
      <button onClick={redirectToProfile}>Profile</button>
      <br />
      <br />
      <br /> <button onClick={handleChats}>Chats</button> <br />
      <button onClick={handleLogout}>Logout</button> <br />
      <br />
      <button onClick={handleImgToText}>Image to text</button>
    </div>
  );
};

export default Navbar;
