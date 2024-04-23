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
       fetchProfile();
      setFormData({ prompt: "" });
    } catch (error) {
      console.error("Error sending prompt:", error.response.data);
    }
  };
const handleTranslate = async (chatId, language) => {
  try {
    await axios.post(
      `http://localhost:8080/chats/translate/${chatId}`,
      { targetLanguage: language }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    fetchProfile();
    navigate(`/chats/${userId}`);
  } catch (error) {
    console.error("Error translating:", error.response.data);
  }
};
  const handleImgToText = () => {
    try {
      navigate(`/chats/image/${userId}`);
    } catch (error) {
      console.log(error);
    }
  };

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
                  <strong>Timestamp:</strong> {chat.timestamp}
                </p>
                <p>
                  <strong>Prompt:</strong> {chat.prompt}
                </p>
                <p>
                  <strong>Response:</strong> {chat.responseData}
                </p>
                <select
                  id="language-select"
                  onChange={(e) => handleTranslate(chat._id, e.target.value)}
                >
                  <option disabled selected hidden>
                    Translate to
                  </option>
                  <option value="en" data-lang-code="en">
                    English
                  </option>
                  <option value="bn" data-lang-code="bn">
                    Bengali
                  </option>
                  <option value="hi" data-lang-code="hi">
                    Hindi
                  </option>
                  <option value="es" data-lang-code="es">
                    Spanish
                  </option>
                  <option value="ja" data-lang-code="ja">
                    Japanese
                  </option>
                  <option value="fr" data-lang-code="fr">
                    French
                  </option>
                  <option value="de" data-lang-code="de">
                    German
                  </option>
                  <option value="it" data-lang-code="it">
                    Italian
                  </option>
                </select>
                <br />
                <br />
                <br />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
      <button onClick={handleLogout}>Logout</button> <br />
      <br />
      <br />
      <button onClick={redirectToProfile}>Profile</button>
      <br />
      <br />
      <button onClick={handleImgToText}>Image to text</button>
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
