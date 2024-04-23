// import React, { useState } from "react";
// import axios from "axios";

// const ImageUpload = ({ userId, accessToken, setResponseData }) => {
//   const [image, setImage] = useState(null);
//   const [prompt, setPrompt] = useState("");
//   const [responseText, setResponseText] = useState("");
//   const [responseImage, setResponseImage] = useState(null);

//   const handleImageChange = (event) => {
//     setImage(event.target.files[0]);
//   };

//   const handlePromptChange = (event) => {
//     setPrompt(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append("image", image);
//     formData.append("prompt", prompt);

//     try {
//       const response = await axios.post(
//         `http://localhost:8080/chats/image/${userId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       setResponseText(response.data.text);
//       setResponseImage(response.data.image);
//       setResponseData(response.data.responseData);
//     } catch (error) {
//       console.error("Error uploading image:", error.response.data);
//     }
//   };

//   return (
//     <div>
//       <h2>Image Upload</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="file" onChange={handleImageChange} accept="image/*" />
//         <br />
//         <input
//           type="text"
//           value={prompt}
//           onChange={handlePromptChange}
//           placeholder="Enter prompt here"
//         />
//         <br />
//         <button type="submit">Submit</button>
//       </form>
//       {responseText && <p>Text Response: {responseText}</p>}
//       {responseImage && (
//         <div>
//           <p>Image:</p>
//           <img
//             src={`data:image/jpeg;base64,${responseImage}`}
//             alt="Response Image"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImageUpload;
