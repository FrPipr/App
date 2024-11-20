import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Account from "./Account";
import AddProduct from "./AddProduct";
import ScanProduct from "./ScanProduct";
import Navbar from "./components/Navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      {isLoggedIn && (
        <Navbar/>
      )}

      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/add-product" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/add-product" /> : <SignUp />} />
        <Route path="/add-product" element={isLoggedIn ? <AddProduct /> : <Navigate to="/login" />} />
        <Route path="/scan-product" element={<ScanProduct />} />
        <Route path="/account" element={isLoggedIn ? <Account setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/add-product" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;