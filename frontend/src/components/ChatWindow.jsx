import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";

const ChatWindow = () => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({ prompt: "" });
  const [selectedDate, setSelectedDate] = useState("");
  const [listening, setListening] = useState(false);
  const [chatDates, setChatDates] = useState([]);
  const [selectedDateChats, setSelectedDateChats] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const { userId } = useParams();
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchChatDates();
    setCurrentDate(getFormattedDate());
    fetchChatsForDate(getFormattedDate()); // Fetch chats for the current date
  }, [userId, accessToken]);

  const fetchChatsForDate = async (date) => {
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

  const getFormattedDate = () => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
      const response = await axios.get(
        `http://localhost:8080/chats/${userId}/${currentDate}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSelectedDateChats(response.data.chats);
      navigate(`/chats/${userId}`);
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
        <div className="mt-auto flex items-center justify-center">
          <TextField
            id="prompt"
            name="prompt"
            label="Ask me anything"
            value={formData.prompt}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            size="small"
            sx={{
              width: "70%",
              mr: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused": {
                  borderColor: "black",
                },
              },
            }}
            multiline
            rows={2}
          />
          <div>
            <IconButton onClick={handleSpeak} disabled={listening}>
              <MicIcon />
            </IconButton>
            <IconButton onClick={sendPrompt}>
              <SendIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
