import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, Form, Button } from 'react-bootstrap';

function Certifications({ productId }) {
  const [certifications, setCertifications] = useState([]);
  const [certificationType, setCertificationType] = useState('');
  const [certifyingBody, setCertifyingBody] = useState('');
  const [issueDate, setIssueDate] = useState('');

  // Fetch certifications when component mounts or itemCode changes
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/getAllCertifications?productId=${productId}`)
      .then((response) => {
        setCertifications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching certifications:", error);
      });
  }, [productId]);

  // Handle adding a new certification
  const handleAddCertification = () => {
    const data = {
      id: productId, // Include the product ID in the request payload
      certificationType,
      certifyingBody,
      issueDate
    };

    console.log("Sending certification data:", data);

    axios.post('http://127.0.0.1:5000/addCertification', data)
      .then((response) => {
        alert(response.data.message);
        setCertifications([...certifications, data]); // Append new certification to list
        setCertificationType('');
        setCertifyingBody('');
        setIssueDate('');
      })
      .catch((error) => {
        console.error("Error adding certification:", error);
        alert("Error adding certification:", error);
      });
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <h4>Certifications</h4>
      </Card.Header>
      <Card.Body>
        {certifications.length > 0 ? (
          <ListGroup>
            {certifications.map((cert, index) => (
              <ListGroup.Item key={index}>
              <strong>Type:</strong> {cert.CertificationType ? cert.CertificationType : cert.certificationType}<br />
              <strong>Certifying Body:</strong> {cert.CertifyingBody ? cert.CertifyingBody : cert.certifyingBody}<br />
              <strong>Issue Date:</strong> {cert.IssueDate ? cert.IssueDate: cert.issueDate}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No certifications available for this product.</p>
        )}

        {/* Add a new certification */}
        <Form className="mt-4">
          {/* Hidden field to include the itemCode (product ID) */}
          <Form.Control
            type="hidden"
            value={productId}
          />

          <Form.Group controlId="CertificationType">
            <Form.Label>Certification Type</Form.Label>
            <Form.Control
              type="text"
              value={certificationType}
              onChange={(e) => setCertificationType(e.target.value)}
              placeholder="Enter certification type"
            />
          </Form.Group>

          <Form.Group controlId="CertifyingBody" className="mt-3">
            <Form.Label>Certifying Body</Form.Label>
            <Form.Control
              type="text"
              value={certifyingBody}
              onChange={(e) => setCertifyingBody(e.target.value)}
              placeholder="Enter certifying body"
            />
          </Form.Group>

          <Form.Group controlId="IssueDate" className="mt-3">
            <Form.Label>Issue Date</Form.Label>
            <Form.Control
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </Form.Group>

          <Button
            className="mt-3"
            variant="primary"
            onClick={handleAddCertification}
            disabled={!certificationType || !certifyingBody || !issueDate}
          >
            Add Certification
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Certifications;
