import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/access/Login";
import Chat from "./pages/chat/Chat";
import "./App.css";

function App() {
  const [idValue, setIdValue] = useState("");
  const [apiValue, setApiValue] = useState("");

  function handleIdCallback(id) {
    console.log(id)
    setIdValue(id);
  }

  function handleApiCallback(api) {
    console.log(api)
    setApiValue(api);
  }

  return (
    <Routes>
      <Route path="/" element={<Login id={handleIdCallback} api={handleApiCallback} />} />
      <Route path="/Chat" element={<Chat idInstance={idValue} apiTokenInstance={apiValue} />} />
    </Routes>
  );
}

export default App;
