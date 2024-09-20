import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';

function AddMovement({ productId, onAddMovement }) {
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  // Handle adding a new movement
  const handleAddMovement = () => {
    const data = {
      id: productId, // Include the product ID in the request payload
      location,
      status,
      date
    };

    console.log("Sending movement data:", data);

    axios.post('http://127.0.0.1:5000/addMovementsData', data)
      .then((response) => {
        alert(response.data.message);
        
        // If the API call is successful, create a new movement object
        const newMovement = {
          id: response.data.id, // Assuming the response returns the new ID
          Location: location,
          Date: date,
          Status: status
        };

        // Call the prop function to add the movement to the list
        onAddMovement(newMovement);

        // Reset form fields
        setLocation('');
        setStatus('');
        setDate('');
      })
      .catch((error) => {
        console.error("Error adding movement:", error);
      });
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <h4>Add Movement</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          {/* Hidden field to include the itemCode (product ID) */}
          <Form.Control
            type="hidden"
            value={productId}
          />

          <Form.Group controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              required
            />
          </Form.Group>

          <Form.Group controlId="status" className="mt-3">
            <Form.Label>Status</Form.Label>
            <Form.Control
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Enter status"
              required
            />
          </Form.Group>

          <Form.Group controlId="date" className="mt-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            className="mt-3"
            variant="primary"
            onClick={handleAddMovement}
            disabled={!location || !status || !date}
          >
            Add Movement
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AddMovement;
