import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import Profile from "./components/Profile";
import LoginForm from "./components/LoginForm";
import ChatWindow from "./components/ChatWindow";

const App = () => {
  return (
    <div>
      <h1>Chatbot</h1>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/chats/:userId" element={<ChatWindow />} />
      </Routes>
    </div>
  );
};

export default App;
