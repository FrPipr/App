import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const data = response.data;

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("manufacturer", data.manufacturer);
      localStorage.setItem("email", data.email);
      setIsLoggedIn(true);
      setMessage("Login successful!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        // Messaggio di errore dal backend
        console.log(error.response.data.message);
        setMessage(error.response.data.message);
      } else {
        // Errore generico
        console.log(error.message);
        setMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6" style={{ textAlign: "center" }}>
          {/* Logo */}
          <div
            style={{
              textAlign: 'center',
              width: "100%",
              marginTop:"-4vw"
            }}
          >
            <img
              src={require("../logo_filiera360.png")}
              style={{
                width: "30%",
              }}
            />
          </div>
          <br />
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title">Login</h3>
              <br />
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mt-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary mt-3 w-100" type="submit">Login</button>
              </form>
              {message && <p className="mt-3 text-muted">{message}</p>}
              <p className="mt-3">
                Don’t have an account?{" "}
                <span onClick={() => navigate("/signup")} style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3">
        <span onClick={() => navigate("/scan-product")} style={{ color: "darkgrey", cursor: "pointer", textDecoration:"underline" }}>
          Continue without logging in
        </span>
      </p>
    </div>
  );
};

export default Login;