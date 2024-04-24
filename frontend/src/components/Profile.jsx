import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

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

  return (
    <div className="flex">
      <Navbar userId={userId} />
      <div className="profile-content" style={{ padding: "20px" }}>
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
      </div>
    </div>
  );
};

export default Profile;
