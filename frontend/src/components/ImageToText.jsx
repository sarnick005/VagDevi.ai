import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";

const ImageToText = () => {
  const [profileData, setProfileData] = useState(null);
  const [responseData, setResponseData] = useState(null); // State to store responseData
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

        const formattedProfileData = {
          ...response.data,
          profile_data: {
            ...response.data.profile_data,
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

  const redirectToProfile = () => {
    navigate(`/profile/${userId}`);
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
      <h2>Image to text</h2>
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
      <br />
      <br />
      <button onClick={redirectToProfile}>Profile</button>
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button> <br />
      <br />
      <button onClick={handleChats}>Chats</button> <br />
      <br />
      <ImageUpload
        userId={userId}
        accessToken={accessToken}
        setResponseData={setResponseData} // Pass setResponseData function
      />
      {/* Display responseData if available */}
      {responseData && (
        <div>
          <p>Response Data:</p>
          <p>{responseData}</p>
        </div>
      )}
    </div>
  );
};

export default ImageToText;
