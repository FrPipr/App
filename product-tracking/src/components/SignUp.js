import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        manufacturer,
        email,
        password,
      });
      const data = response.data;

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        // Se il server ha restituito un messaggio di errore
        setMessage(error.response.data.message);
      } else {
        // Altrimenti, un errore generico
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
              marginTop: "-4vw"
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
              <div
                onClick={() => navigate("/login")}
                style={{ position: "absolute", fontSize: "2.3vw", display: "flex", marginTop: "0.5vw", cursor:"pointer", color:"grey" }}
              >
                <ion-icon name="arrow-back-circle-outline"></ion-icon>
              </div>
              <h3 className="card-title">Sign Up</h3>
              <br />
              <form onSubmit={handleSignUp}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Manufacturer Name"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mt-3">
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary mt-3 w-100" type="submit">Sign Up</button>
              </form>
              {message && <p className="mt-3 text-muted">{message}</p>}
              <p className="mt-3">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")} style={{ color: "blue", cursor: "pointer" }}>Login</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};

export default SignUp;