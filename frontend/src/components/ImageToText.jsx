import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Navbar from "./Navbar"; // Import Navbar component
import axios from "axios"; // Import axios for making HTTP requests

const ImageToText = () => {
  const [responseData, setResponseData] = useState(null);
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [responseImage, setResponseImage] = useState(null);
  const { userId } = useParams();
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();
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
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image || !prompt) {
      console.error("No image or prompt provided");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("prompt", prompt);

    const base64Image = await convertFileToBase64(image);

    const requestData = {
      img: {
        filename: image.name,
        data: base64Image,
      },
      prompt: prompt,
    };

    try {
      const response = await axios.post(
        `http://localhost:8080/chats/image/${userId}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setResponseText(response.data.text);
      setResponseImage(response.data.image);
      setResponseData(response.data.responseData);
      setPrompt(response.data.prompt);
      fetchChats(); // Fetch chats after updating
    } catch (error) {
      console.error("Error uploading image:", error.response.data);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result.split(",")[1]);
      fileReader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <Navbar userId={userId} /> {/* Set the Navbar component here */}
      <div className="fixed inset-0 flex justify-center items-center overflow-hidden">
        <div className="w-[1200px] max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Image to Text</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex">
              {" "}
              {/* Center the input field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden" // Hide the default file input
                  id="image-upload" // Add an ID for label association
                />
                <label
                  htmlFor="image-upload" // Associate the label with the file input
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white text-gray-700 hover:border-gray-500 cursor-pointer" // Style the label to mimic the file input
                >
                  Choose File
                </label>

                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Uploaded Image Preview"
                    className="mt-2 rounded-md"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-row">
              <div className="mb-4 w-[500px]">
                <TextField
                  type="text"
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder="Enter prompt here"
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="w-[300px]"
                />
              </div>
              <div>
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </form>
          {responseData && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Prompt:</p>
              <p className="mt-1 text-sm text-gray-500">{prompt}</p>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Response Data:
              </p>
              <div className="w-full max-w-md overflow-y-auto h-[200px]">
                <p className="mt-1 text-sm text-gray-500">{responseData}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageToText;
