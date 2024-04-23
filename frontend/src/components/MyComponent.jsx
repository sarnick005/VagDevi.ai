// frontend/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const MyComponent = () => {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Image uploaded successfully");
      fetchImages(); // Refresh images after upload
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:8080/images");
      setImages(response.data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div>
      <h1>Upload and Display Image</h1>
      <div>
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleSubmit}>Upload</button>
      </div>
      {image && (
        <div>
          <h2>Uploaded Image Preview</h2>
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded Image"
            style={{ maxWidth: "100%", maxHeight: "400px" }}
          />
        </div>
      )}
      <h2>Image Gallery</h2>
      <div className="image-container">
        {images.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:8080/${img.filename}`}
            alt={`Image ${index}`}
            style={{ maxWidth: "200px", margin: "5px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default MyComponent;
