import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

const Bookmark = ({ userId: propUserId }) => {
  const [bookmarkedChats, setBookmarkedChats] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const { userId: routeUserId } = useParams();
  const userId = propUserId || routeUserId;
  const accessToken = localStorage.getItem("access_token");

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

  useEffect(() => {
    fetchBookmarkedChats(userId);
  }, [userId]);

  const fetchBookmarkedChats = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/chats/bookmark/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setBookmarkedChats(response.data.bookmarked_chats);
    } catch (error) {
      console.error("Error fetching bookmarked chats:", error.response.data);
    }
  };
const styles = {
  scrollableContainer: {
    maxHeight: "700px",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#888 #f1f1f1",
    width: "800px",
  },
};
  return (
    <div className="overflow-hidden">
      {" "}
      <Navbar userId={userId} />
      <div
        className="flex flex-row"
        style={{
          width: "800px",
          height: "750px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          position: "absolute",
          left: "500px",
          top: "0px",
          overflowY: "auto",
          maxHeight: "900px",
        }}
      >
        
        <div className="m-4" div style={styles.scrollableContainer}>
          <ul>
            {bookmarkedChats.map((chat, index) => (
              <li key={index} className="mb-4 border border-black rounded p-4">
                <p>
                  <strong>Timestamp:</strong> {chat.timestamp}
                </p>
                <hr />
                <p className="mb-2">
                  <strong>Prompt:</strong> {chat.prompt}
                </p>
                <hr />
                <p className="mb-2">
                  <strong>Response Data:</strong> {chat.responseData}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Bookmark;
