import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ImageToText = () => {
  const [profileData, setProfileData] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [responseImage, setResponseImage] = useState(null);
  const [chats, setChats] = useState([]);
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

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/chats/image/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setChats(response.data.chats);
      } catch (error) {
        console.error(
          "Error fetching chats:",
          error.response?.data || error.message
        );
      }
    };
    fetchChats();
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

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);
    try {
      const response = await axios.post(
        `http://localhost:8080/chats/image/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setResponseText(response.data.text);
      setResponseImage(response.data.image);
      setResponseData(response.data.responseData);
      fetchChats();
    } catch (error) {
      console.error("Error uploading image:", error.response.data);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/chats/image/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setChats(response.data.chats);
    } catch (error) {
      console.error(
        "Error fetching chats:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <h2>Image to Text</h2>
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
      <button onClick={handleLogout}>Logout</button>
      <br />
      <br />
      <button onClick={handleChats}>Chats</button>
      <br />
      <br />
      <h2>Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <br />
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter prompt here"
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      {responseText && <p>Text Response: {responseText}</p>}
      {responseImage && (
        <div>
          <p>Image:</p>
          <img
            src={`data:image/jpeg;base64,${responseImage}`}
            alt="Response Image"
          />
        </div>
      )}
      <h2>Chats</h2>
      {chats && chats.length > 0 ? (
        <ul>
          {chats.map((chat, index) => (
            <li key={index}>
              <p>Prompt: {chat.prompt}</p>
              <p>Response Data: {chat.responseData}</p>
              <p>Timestamp: {chat.timestamp}</p>
              {chat.imageUrl && (
                <div>
                  <p>Image:</p>
                  <img src={chat.imageUrl} alt="Chat Image" />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No chats</p>
      )}
      {responseData && (
        <div>
          <p>Response Data: </p>
          <p>{responseData}</p>
        </div>
      )}
      <h1>From backend</h1>
      <img src="/backend/uploads/20240423144359.jpg" alt="from-backend" />
    </div>
  );
};

export default ImageToText;
