import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
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

  const getFirstLetter = () => {
    if (
      profileData &&
      profileData.profile_data &&
      profileData.profile_data.username
    ) {
      const username = profileData.profile_data.username;
      return username.charAt(0).toUpperCase();
    }
    return "";
  };

  return (
    <div>
      <Navbar userId={userId} />
      <div className="flex justify-center">
        <div className="profile-card  absolute top-[230px] left-[700px] bg-white rounded-lg shadow-lg p-6">
          {/* Profile Photo */}
          <div className="profile-photo  bg-gray-200 w-24 h-24 flex items-center justify-center rounded-full text-3xl font-bold text-gray-900">
            {getFirstLetter()}
          </div>
          {/* Profile Data */}
          <div className="profile-content mt-4">
            <h2 className="text-xl font-bold mb-2">User Profile</h2>
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
          {/* Buttons */}
          <div className="flex mt-4">
            <Link
              to={`/chats/${userId}`}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 mr-2 rounded"
            >
              Chats
            </Link>
            <Link
              to={`/chats/image/${userId}`}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 mr-2 rounded"
            >
              Image to Chats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
