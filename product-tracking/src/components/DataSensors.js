import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataSensors = ({ productId }) => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/getAllSensorData?productId=${productId}`);
        setSensors(response.data);
      } catch (error) {
        console.error('Failed to fetch sensor data', error);
      }
    };

    fetchSensors();
  }, [productId]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title">Sensor Data</h3>
              <ul className="list-group">
                {sensors.map((sensor) => (
                  <li key={sensor.id} className="list-group-item">
                    <strong>{sensor.Temperature} °C </strong>: {sensor.Humidity} % on {sensor.Timestamp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSensors;
