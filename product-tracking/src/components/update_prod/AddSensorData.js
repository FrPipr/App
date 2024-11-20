import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import Papa from 'papaparse';  // Assicurati di avere papaparse installato

const AddSensorData = ({ productId, onAddSensorData }) => {
  const [sensor_id, setSensor_id] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [message, setMessage] = useState('');
  const [csvFile, setCsvFile] = useState(null);

  const inputWidth = "30%"; // Larghezza fissa per le etichette
  const placeholderText = "+ add new"; // Placeholder universale per i campi di input

  useEffect(() => {
    setSensor_id('');
    setTemperature('');
    setHumidity('');
    setTimestamp('');
    setMessage('');
  }, [productId]);

  // Funzione per aggiungere un nuovo dato del sensore
  const handleAddSensorData = async () => {
    const data = {
      id: productId,
      SensorId: sensor_id,
      Temperature: temperature,
      Humidity: humidity,
      Timestamp: timestamp,
    };

    console.log("Sending sensor data:", data);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://127.0.0.1:5000/addSensorData', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      alert(response.data.message);
      setMessage(response.data.message);

      // Aggiorna la lista dei dati sensoriali
      onAddSensorData(data);

      // Reset dei campi
      setSensor_id('');
      setTemperature('');
      setHumidity('');
      setTimestamp('');
    } catch (error) {
      console.error('Error adding sensor data:', error);
      setMessage(error.response.data.message || 'Failed to add sensor data. Please try again.');
    }
  };

  // Gestore per il caricamento del file CSV
  const handleCsvChange = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      setCsvFile(file);
    }
  };

  // Funzione per gestire il caricamento del CSV e inviare le richieste POST
  const handleCsvUpload = () => {
    if (!csvFile) {
      setMessage('Please upload a CSV file first.');
      return;
    }

    Papa.parse(csvFile, {
      complete: async (result) => {
        for (let row of result.data) {
          console.log(row)
          try {
            const postData = {
              id: productId,
              SensorId: row[0],  // Supponiamo che la prima colonna sia il SensorId
              Temperature: row[1], // Seconda colonna: Temperature
              Humidity: row[2], // Terza colonna: Humidity
              Timestamp: row[3], // Quarta colonna: Timestamp
            };
            // Esegui la richiesta POST per ogni riga
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:5000/addSensorData', postData, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            // Aggiungi i dati dei sensori alla lista
            onAddSensorData(postData);
            setMessage("CSV upload completed successfully!");
          } catch (error) {
            console.error('Error posting data for row:', row, error);
            setMessage(error.response.data.message)
          }
        }
      },
      header: false, // Impostato su false se il CSV non ha intestazioni
    });
  };

  return (
    <Card.Body style={{ paddingBottom: "0" }}>

      <Form>

        {/* CSV File Upload */}
        <Form.Group className="d-flex align-items-center mb-3" style={{marginTop:"1vw"}}>
          <Form.Label style={{ width: inputWidth }} className="me-3">Upload CSV</Form.Label>
          <Form
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: "2vw",
              border: "1px dashed silver",
              borderRadius: "1vw",
              padding: "1vw"
            }}
          >
            {csvFile ?
              <ion-icon
                name="trash-outline"
                style={{ cursor: "pointer", color: "grey" }}
                onClick={() => {document.getElementById("csvFile").value = ''; setCsvFile('')}}
              />
              :
              <ion-icon name="folder-outline" style={{ color: "grey" }}></ion-icon>
            }
            <label htmlFor='csvFile' style={{ color: "grey", textDecoration: "underline", cursor: "pointer" }}>
              {
                csvFile ?
                  JSON.stringify(csvFile.name)
                  :
                  "upload data from CSV file"
              }
            </label>
            <input
              style={{ display: "none" }}
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleCsvChange}
            />
            {csvFile && <Button
              variant="primary"
              style={{ borderRadius: "2vw", paddingBlock: "0" }}
              onClick={handleCsvUpload}
              disabled={!csvFile}
            >
              Submit
            </Button>}
          </Form>
        </Form.Group>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #666' }} />
          <span style={{ margin: '0 10px', color: '#666', fontWeight: 'bold' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #666' }} />
        </div>

        {/* Sensor ID */}
        <Form.Group controlId="sensor_id" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Sensor ID</Form.Label>
          <Form.Control
            type="text"
            value={sensor_id}
            onChange={(e) => setSensor_id(e.target.value)}
            placeholder={placeholderText}
            required
          />
        </Form.Group>

        {/* Temperature */}
        <Form.Group controlId="temperature" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Temperature (°C)</Form.Label>
          <Form.Control
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder={placeholderText}
            required
          />
        </Form.Group>

        {/* Humidity */}
        <Form.Group controlId="humidity" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Humidity (%)</Form.Label>
          <Form.Control
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
            placeholder={placeholderText}
            required
          />
        </Form.Group>

        {/* Timestamp */}
        <Form.Group controlId="timestamp" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Timestamp</Form.Label>
          <Form.Control
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            required
          />
        </Form.Group>

        {/* Submit Button */}
        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="primary"
            onClick={handleAddSensorData}
            disabled={!sensor_id || !temperature || !humidity || !timestamp}
            style={{ width: "200px", margin: "2vw" }}
          >
            Add Sensor Data
          </Button>
        </div>

        {/* Display Message */}
        {message && (
          <p className="mt-3 text-muted text-center">{message}</p>
        )}
      </Form>
    </Card.Body>
  );
};

export default AddSensorData;
