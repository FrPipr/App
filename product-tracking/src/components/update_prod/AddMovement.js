import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';

function AddMovement({ productId, onAddMovement }) {
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const inputWidth = "30%"; // Larghezza fissa per le etichette
  const placeholderText = "+ add new"; // Placeholder universale per i campi di input

  useEffect(() => {
    setLocation('');
    setStatus('');
    setDate('');
    setMessage('');
  }, [productId]);

  // Funzione per aggiungere un nuovo movimento
  const handleAddMovement = () => {
    const data = {
      id: productId,
      location,
      status,
      date,
    };

    console.log("Sending movement data:", data);
    const token = localStorage.getItem('token');
    axios.post('http://127.0.0.1:5000/addMovementsData', data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        alert(response.data.message);
        setMessage(response.data.message);

        // Creare un nuovo oggetto movimento in base alla risposta
        const newMovement = {
          id: response.data.id,
          Location: location,
          Date: date,
          Status: status,
        };

        // Aggiungere il movimento alla lista
        onAddMovement(newMovement);

        // Resettare i campi del modulo
        setLocation('');
        setStatus('');
        setDate('');
      })
      .catch((error) => {
        console.error("Error adding movement:", error);
        setMessage(error.response?.data?.message || "Error adding movement. Please try again.");
      });
  };

  return (
    <Card.Body style={{ paddingBottom: "0" }}>
      <Form>
        <Form.Group controlId="location" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Location</Form.Label>
          <Form.Control
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={placeholderText}
            required
          />
        </Form.Group>

        <Form.Group controlId="status" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Status</Form.Label>
          <Form.Control
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder={placeholderText}
            required
          />
        </Form.Group>

        <Form.Group controlId="date" className="d-flex align-items-center mb-3">
          <Form.Label style={{ width: inputWidth }} className="me-3">Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        {/* Bottone di invio */}
        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="primary"
            onClick={handleAddMovement}
            disabled={!location || !status || !date}
            style={{ width: "200px", margin:"2vw"}}
          >
            Add Movement
          </Button>
        </div>

        {/* Messaggio di feedback */}
        {message && (
          <p className="mt-3 text-muted text-center">{message}</p>
        )}
      </Form>
    </Card.Body>
  );
}

export default AddMovement;
