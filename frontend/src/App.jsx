import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import Profile from "./components/Profile";
import LoginForm from "./components/LoginForm";
import ChatWindow from "./components/ChatWindow";
import Home from "./components/Home";
import ImageToText from "./components/ImageToText";
import MyComponent from './components/MyComponent';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/chats/:userId" element={<ChatWindow />} />
        <Route path="/chats/image/:userId" element={<ImageToText />} />
      </Routes>
    </div>
  );
};

export default App;
