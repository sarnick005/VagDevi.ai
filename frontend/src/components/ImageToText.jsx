import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const ImageToText = () => {
  const [responseData, setResponseData] = useState(null);
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [responseImage, setResponseImage] = useState(null);
  const { userId } = useParams();
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();

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
    <div className="flex">
      <Navbar userId={userId} />
      <div className="image-to-text-content" style={{ padding: "20px" }}>
        <h2>Image to Text</h2>
        <h2>Image Upload</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleImageChange} accept="image/*" />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded Image Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                marginTop: "10px",
              }}
            />
          )}
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
        {responseData && (
          <div>
            <p>Prompt:</p>
            <p>{prompt}</p>
          </div>
        )}
        {responseData && (
          <div>
            <p>Response Data:</p>
            <pre>{responseData}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToText;
