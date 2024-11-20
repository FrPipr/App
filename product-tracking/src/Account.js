import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";

const Account = ({ setIsLoggedIn }) => {
  const navigate = useNavigate()
  const [manufacturer, setManufacturer] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    setManufacturer(localStorage.getItem("manufacturer"))
    setEmail(localStorage.getItem("email"))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <Card.Header style={{textAlign:"center"}}>
                <h4>Account 👤</h4>
              </Card.Header>
              <br/>
              <div className="form-group">
                <h4 style={{ textAlign: "center", fontWeight: "lighter" }}>Manufacturer: <b>{manufacturer}</b></h4>
                <h4 style={{ textAlign: "center", fontWeight: "lighter" }}>email: <b>{email}</b></h4>
                <button onClick={handleLogout} className="btn btn-primary mt-3 w-100">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;