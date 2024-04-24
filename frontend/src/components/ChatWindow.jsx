import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ChatWindow = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({ prompt: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [listening, setListening] = useState(false);
  const [chatDates, setChatDates] = useState([]);
  const [selectedDateChats, setSelectedDateChats] = useState([]);
  const { userId } = useParams();
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  const handleDateButtonClick = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/chats/${userId}/${date}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSelectedDateChats(response.data.chats);
      setSelectedDate(date);
    } catch (error) {
      console.error("Error fetching chats for date:", error.response.data);
    }
  };

  const sendPrompt = async () => {
    try {
      await axios.post(`http://localhost:8080/chats/${userId}`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
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
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );


    const response = await axios.get(
      `http://localhost:8080/chats/${userId}/${selectedDate}`, 
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    setSelectedDateChats(response.data.chats);

    navigate(`/chats/${userId}`);
  } catch (error) {
    console.error("Error translating:", error.response.data);
  }
};

  const handleSpeak = async () => {
    try {
      setListening(true);
      const response = await axios.post(`http://localhost:8080/chats/voice`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(accessToken);
      navigate(`/chats/${userId}`);
      setFormData({ ...formData, prompt: response.data.recognized_text });
    } catch (error) {
      console.error("Error fetching profile data:", error.response.data);
    } finally {
      setListening(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchChatDates();
  }, [userId, accessToken]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/profile/${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error.response.data);
      setProfileData(null);
    }
  };

  const fetchChatDates = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/chats/dates/${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setChatDates(response.data.dates);
    } catch (error) {
      console.error("Error fetching chat dates:", error.response.data);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed left-0 top-0 h-screen">
        <Navbar userId={userId} />
      </div>
      <div className="ml-64 flex flex-col overflow-y-auto p-4 ">
        <h2 className="mb-4  ">Chat Data</h2>
        <div
          className=" p-4 h-[300px] absolute left-[0px] top-[60px] text-white"
          style={{ maxHeight: "400px", height: "400px", overflowY: "auto" }}
        >
          {chatDates.length > 0 ? (
            <div className="mb-4 flex flex-col ">
              {chatDates.map((date) => (
                <button
                  key={date}
                  className="w-[220px] mb-2 mr-2 rounded border border-gray-300 px-3 py-2 hover:bg-gray-100  hover:text-black"
                  onClick={() => handleDateButtonClick(date)}
                >
                  {date}
                </button>
              ))}
            </div>
          ) : (
            <p>No chat dates found.</p>
          )}
        </div>
        {profileData && profileData.profile_data ? (
          <div>
            <p>
              {/* <strong>Username:</strong> {profileData.profile_data.username} */}
            </p>
            <p>
              {/* <strong>Email:</strong> {profileData.profile_data.email} */}
            </p>
            <div>
              {/* <h3 className="mb-2">Chats:</h3> */}
              {selectedDateChats.length > 0 ? (
                selectedDateChats.map((chat) => (
                  <div key={chat._id} className="mb-4">
                    <p>
                      <strong>Timestamp:</strong> {chat.date}
                    </p>
                    <p>
                      <strong>Prompt:</strong> {chat.prompt}
                    </p>
                    <p>
                      <strong>Response:</strong> {chat.responseData}
                    </p>
                    <select
                      id="language-select"
                      value={""}
                      onChange={(e) =>
                        handleTranslate(chat._id, e.target.value)
                      }
                      className="mt-2 block"
                    >
                      <option disabled value="">
                        Translate to
                      </option>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="bn">Bengali</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                      <option value="es">Spanish</option>
                    </select>
                    <br />
                    <br />
                    <br />
                  </div>
                ))
              ) : (
                <p>No chats for this date.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <br />
            <br />
            <button onClick={handleSpeak}>Speak</button>
            {listening && <p>Listening...</p>}
            <br />
          </form>
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
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              />
            </div>
            <br />
            <br />
            <button style={{ backgroundColor: "#73eb85" }} onClick={sendPrompt}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
