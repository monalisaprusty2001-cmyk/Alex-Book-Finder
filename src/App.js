import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage.js";
import BookFinder from "./components/BookFinder";

function App() {
  // simple auth check
  const isLoggedIn = !!localStorage.getItem("alex_user");

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/search" /> : <LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/search"
        element={
          isLoggedIn ? <BookFinder /> : <Navigate to="/login" />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
