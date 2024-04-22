import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const { userId } = useParams();
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
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

        // Parse and format the timestamp
        const formattedProfileData = {
          ...response.data,
          profile_data: {
            ...response.data.profile_data,
            // Assuming the timestamp key is "timestamp"
            timestamp: new Date(
              response.data.profile_data.timestamp
            ).toLocaleString(),
          },
        };

        setProfileData(formattedProfileData);
      } catch (error) {
        console.error("Error fetching profile data:", error.response.data);
        setProfileData(null);
      }
    };

    fetchProfile();
  }, [userId, accessToken]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout");
      localStorage.removeItem("access_token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.response.data);
    }
  };

  const handleChats = async () => {
    try {
      navigate(`/chats/${userId}`);
    } catch (error) {
      console.error("Chat not found:", error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {profileData ? (
        <div>
          <p>
            <strong>Username:</strong> {profileData.profile_data.username}
          </p>
          <p>
            <strong>Email:</strong> {profileData.profile_data.email}
          </p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
      <button onClick={handleLogout}>Logout</button> <br />
      <br />
      <button onClick={handleChats}>Chats</button>
    </div>
  );
};

export default Profile;
