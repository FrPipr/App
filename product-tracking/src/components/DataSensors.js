import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddSensorData from './update_prod/AddSensorData';
import { Button, Card } from 'react-bootstrap';

const DataSensors = ({ productId }) => {
  const [sensors, setSensors] = useState([]);
  const [showAddSensor, setShowAddSensor] = useState(false);
  const [productManufacturer, setProductManufacturer] = useState('')

  // Funzione per formattare la data e l'ora
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-EN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchSensors = useCallback(async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/getAllSensorData?productId=${productId}`);
      setSensors(response.data);
    } catch (error) {
      console.error('Failed to fetch sensor data', error);
    }

    const getProductManufacturer = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/getProduct?productId=${productId}`);
        if (response.status === 200) {
          setProductManufacturer(response.data.Manufacturer);
        } else {
          console.log('Product not found.');
        }
      } catch (error) {
        console.log('Failed to fetch product details.');
      }
    }
    getProductManufacturer()
  }, [productId]);

  useEffect(() => {
    fetchSensors();
    setShowAddSensor(false)
  }, [fetchSensors]);

  const addSensorData = (newSensorData) => {
    setSensors((prevSensors) => [...prevSensors, newSensorData]);
    setShowAddSensor(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <br />
            <h3>Sensor Data 🌡️</h3>
            <Card.Body>
              <ul className="list-group" style={{ maxHeight: "20vw", overflowY: "auto" }}>
                {sensors.length > 0 ? (
                  sensors.map((sensor, index) => (
                    <li key={index} className="list-group-item">
                      <strong>Sensor id:</strong> {sensor.SensorId || "unknown"}
                      <br />
                      <strong>Temperature:</strong> {sensor.Temperature} °C
                      <br />
                      <strong>Humidity:</strong> {sensor.Humidity}%
                      <br />
                      <strong>Timestamp:</strong> {formatTimestamp(sensor.Timestamp)}
                    </li>
                  ))
                ) : (
                  <li className="list-group-item">No sensor data available.</li>
                )}
              </ul>
              {productManufacturer === localStorage.getItem("manufacturer") ? (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1vw",
                    marginTop: showAddSensor ? "4vw" : "2vw"
                  }}
                >
                  {showAddSensor ? <h4>👇 Add Sensor Data</h4> : null}
                  <Button
                    onClick={() => setShowAddSensor(!showAddSensor)}
                    style={{ backgroundColor: showAddSensor ? "darkgray" : "#a6d05f", border: 0 }}
                  >
                    {showAddSensor ? 'Cancel' : 'Add New Sensor Data'}
                  </Button>
                </div>
              ) : null}
              {
                showAddSensor && productManufacturer === localStorage.getItem("manufacturer") &&
                <AddSensorData productId={productId} onAddSensorData={addSensorData} />
              }
            </Card.Body>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSensors;
