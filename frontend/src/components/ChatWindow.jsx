import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ChatWindow = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    prompt: "",
  });
  const { userId } = useParams();
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
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
      await axios.post("http://localhost:8080/logout");
      localStorage.removeItem("access_token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.response.data);
    }
  };
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const monthIndex = date.getMonth();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[monthIndex];
  const year = date.getFullYear();
  return `${day} ${monthName} ${year}`;
};
  const redirectToProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendPrompt = async () => {
    try {
      await axios.post(`http://localhost:8080/chats/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // After sending prompt, fetch profile data again to update chat window
      fetchProfile();
      setFormData({ prompt: "" });
    } catch (error) {
      console.error("Error sending prompt:", error.response.data);
    }
  };

  // // Function to format timestamp
  // const formatTimestamp = (timestamp) => {
  //   return new Date(timestamp).toLocaleString();
  // };

  return (
    <div>
      <h2>Chat Data</h2>
      {profileData && profileData.profile_data ? (
        <div>
          <p>
            <strong>Username:</strong> {profileData.profile_data.username}
          </p>
          <p>
            <strong>Email:</strong> {profileData.profile_data.email}
          </p>
          <div>
            <h3>Chats:</h3>
            {profileData.chats.map((chat) => (
              <div key={chat._id}>
                <p>
                  <strong>Timestamp:</strong> {formatDate(chat.timestamp)}
                </p>
                <p>
                  <strong>Prompt:</strong> {chat.prompt}
                </p>
                <p>
                  <strong>Response:</strong> {chat.responseData}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
      <button onClick={handleLogout}>Logout</button> <br />
      <br />
      <button onClick={redirectToProfile}>Profile</button>
      <br />
      <br />
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="prompt">Prompt:</label>
            <input
              type="text"
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <br />
          <br />
          <button style={{ backgroundColor: "#73eb85" }} onClick={sendPrompt}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
